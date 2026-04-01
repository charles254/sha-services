#!/bin/bash
# SHA Cyber Services — Deploy Script for Contabo VPS
# Run as root: bash deploy.sh

set -e

APP_DIR="/opt/sha-services"
DOMAIN="shacyberservices.com"
REPO="https://github.com/charles254/sha-services.git"

echo "=== SHA Cyber Services Deployment ==="

# 1. Install Docker if not present
if ! command -v docker &> /dev/null; then
  echo "[1/7] Installing Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
else
  echo "[1/7] Docker already installed."
fi

# 2. Install Docker Compose if not present
if ! command -v docker compose &> /dev/null; then
  echo "[2/7] Installing Docker Compose..."
  apt-get update && apt-get install -y docker-compose-plugin
else
  echo "[2/7] Docker Compose already installed."
fi

# 3. Clone or update the repo
if [ -d "$APP_DIR" ]; then
  echo "[3/7] Updating repository..."
  cd "$APP_DIR" && git pull origin main
else
  echo "[3/7] Cloning repository..."
  git clone "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 4. Create .env if it doesn't exist
if [ ! -f "$APP_DIR/.env" ]; then
  echo "[4/7] Creating .env file — YOU MUST EDIT THIS!"
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  echo ""
  echo ">>> IMPORTANT: Edit /opt/sha-services/.env with your real credentials <<<"
  echo ">>> Run: nano /opt/sha-services/.env <<<"
  echo ""
else
  echo "[4/7] .env already exists."
fi

# 5. Build and start containers
echo "[5/7] Building and starting containers..."
cd "$APP_DIR"
docker compose down 2>/dev/null || true
docker compose up -d --build

# 6. Run database migrations
echo "[6/7] Running database migrations..."
docker compose exec -T app npx prisma db push --skip-generate 2>/dev/null || \
  echo "Note: DB migration skipped — run manually if needed."

# 7. Set up Apache vhost
echo "[7/7] Setting up Apache..."
if [ ! -f "/etc/apache2/sites-available/$DOMAIN.conf" ]; then
  cat > "/etc/apache2/sites-available/$DOMAIN.conf" <<VHOST
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    RewriteEngine On
    RewriteRule ^(.*)\$ https://%{HTTP_HOST}\$1 [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN

    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/$DOMAIN/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/$DOMAIN/privkey.pem

    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3000/
    ProxyPassReverse / http://127.0.0.1:3000/

    # WebSocket support (for HMR in dev, optional in prod)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule /(.*) ws://127.0.0.1:3000/\$1 [P,L]

    # Security headers
    Header always set X-Content-Type-Options "nosniff"
    Header always set X-Frame-Options "DENY"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</VirtualHost>
VHOST

  a2enmod proxy proxy_http proxy_wstunnel rewrite ssl headers
  a2ensite "$DOMAIN.conf"
  systemctl reload apache2
  echo "Apache vhost created. Get SSL with: certbot --apache -d $DOMAIN -d www.$DOMAIN"
else
  echo "Apache vhost already exists."
  systemctl reload apache2
fi

echo ""
echo "=== Deployment Complete ==="
echo "1. Edit .env:        nano /opt/sha-services/.env"
echo "2. Get SSL cert:     certbot --apache -d $DOMAIN -d www.$DOMAIN"
echo "3. Rebuild after .env changes: cd /opt/sha-services && docker compose up -d --build"
echo "4. View logs:        cd /opt/sha-services && docker compose logs -f"
echo ""
