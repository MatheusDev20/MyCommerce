provider "aws" {
  region                   = var.aws_region
  shared_credentials_files = ["~/.aws/credentials"]
  profile                  = "matheus"

  default_tags {
    tags = {
      project = "my-commerce"
    }
  }
}

locals {
  zip_name       = "lambda_function_payload.zip"
  zip_folder     = "../../../../outputs/server"
  # Example output: "../../../../outputs/server/mycommerce-20251004.zip"
  zip_output     = "${local.zip_folder}/mycommerce-${var.service_version}.zip"
  # S3 key now includes version folder, e.g. "releases/20251004/lambda_function_payload.zip"
  s3_key         = "releases/${var.service_version}/${local.zip_name}"
}

variable "service_version" {
  description = "Version of the service (Just a timestamp for now)"
  type        = string
}

# ---- Bucket to Store Lambda function code ----
resource "random_pet" "lambda_bucket_name" {
  prefix = "mycommerce-lambda-bucket"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id
}

resource "aws_s3_bucket_ownership_controls" "lambda_bucket" {
  bucket = aws_s3_bucket.lambda_bucket.id
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "lambda_bucket" {
  depends_on = [aws_s3_bucket_ownership_controls.lambda_bucket]
  bucket     = aws_s3_bucket.lambda_bucket.id
  acl        = "private"
}

# ---- Zip the Lambda Function Code ----
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = local.zip_folder
  output_path = local.zip_output
}

# ---- Upload Lambda ZIP to S3 (versioned folder) ----
resource "aws_s3_object" "lambda_zip" {
  bucket = aws_s3_bucket.lambda_bucket.id

  # Now versioned by folder:
  # s3://mycommerce-lambda-bucket-xxxx/releases/20251004/lambda_function_payload.zip
  key    = local.s3_key
  source = data.archive_file.lambda_zip.output_path

  etag = filemd5(data.archive_file.lambda_zip.output_path)
}


## Lambda Function
resource "aws_lambda_function" "mycommerce_api" {
  function_name = "mycommerce_api"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_zip.key

  runtime = "nodejs20.x"
  handler = "lambda.handler"

  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  role = aws_iam_role.mycommerce_api_lambda_exec.arn
}

resource "aws_cloudwatch_log_group" "mycommerce_api" {
  name = "/aws/lambda/${aws_lambda_function.mycommerce_api.function_name}"

  retention_in_days = 30
}

resource "aws_iam_role" "mycommerce_api_lambda_exec" {
  name = "mycommerce_api_lambda_exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_policy" {
  role       = aws_iam_role.mycommerce_api_lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

