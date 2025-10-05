terraform {

  backend "s3" {
    bucket = "mycommerce-prj"
    key    = "mycommerce-prj/terraform.tfstate"
    region = "us-east-1"
    shared_credentials_file = "~/.aws/credentials"
    profile                 = "matheus"
  }
}