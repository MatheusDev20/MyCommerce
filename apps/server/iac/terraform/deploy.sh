
#!/bin/bash

echo "Starting the deployment script..."

cd "$(dirname "$0")/../../" || { echo "Failed to navigate to the project root."; exit 1; }\

echo "Loading environment from .env"
export $(grep -v '^#' .env | xargs)

TIMESTAMP=$(date +%Y%m%d%H%M%S)
SERVICE_NAME="mycommerce"
ROOT_DIR=$(git rev-parse --show-toplevel)
APP_DIR="${ROOT_DIR}/apps/server"
OUT_DIR="${APP_DIR}/.build"
ZIP_PATH="${ROOT_DIR}/outputs/server/${SERVICE_NAME}-${TIMESTAMP}.zip"

# ----------------- Env Vars ----------------- #
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
DATABASE_URL=$DATABASE_URL
POSTGRES_USER=$POSTGRES_USER
POSTGRES_DB=$POSTGRES_DB

# # Se alguma variável de ambiente estiver vazia, saia do script
Variables=("POSTGRES_PASSWORD" "DATABASE_URL" "POSTGRES_USER" "POSTGRES_DB")

for var in "${Variables[@]}"; do
  if [ -z "${!var}" ]; then
    echo "A variável de ambiente $var está vazia. Por favor, verifique as variáveis de ambiente necessárias em local.env e tente novamente."
    exit 1
  fi
done

echo "🔧 Cleaning old builds..."
rm -rf "${OUT_DIR}" "${ZIP_PATH}"

echo "📦 Installing production dependencies..."
cd "${APP_DIR}"

npm ci && npm run build && npm prune --production
echo "🗂️ Preparing build folder..."
mkdir -p "${OUT_DIR}"
cp -r dist/* "${OUT_DIR}/"

cp -r node_modules "${OUT_DIR}/"
cp package.json "${OUT_DIR}/"

echo "🧱 Zipping..."
cd "${OUT_DIR}"
echo $PWD
zip -rq "${ZIP_PATH}" .

echo "✅ Build complete: ${ZIP_PATH}"

# Implanta a infraestrutura
cd ../iac/terraform &&\
terraform plan \
  -input=false \
  -var service_version="$TIMESTAMP" \
  -out=./tfplan

# terraform apply -input=false ./tfplan