#!/bin/bash

# Go to app directory
cd "$APP_DIR" || { echo "Directory $APP_DIR not found"; exit 1; }

# Update system
echo "1. Updating system..."
sudo apt update && sudo apt upgrade -y

# Install dependencies
echo "2. Installing dependencies..."
sudo apt install -y curl build-essential

# Install Node.js (LTS)
echo "3. Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Configure npm global directory (to avoid EACCES error)
echo "4. Configuring npm global directory..."
mkdir -p "${HOME}/.npm-global"
npm config set prefix "${HOME}/.npm-global"
export PATH="$HOME/.npm-global/bin:$PATH"
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Install NestJS CLI and PM2
echo "5. Installing NestJS CLI and PM2..."
npm install -g @nestjs/cli pm2
export PATH="$PATH:$(npm prefix -g)/bin"

# Install node modules
echo "6. Installing dependencies..."
npm install

# Build project
echo "7. Building project..."
npm run build

# Install PrismaORM & migrate DB
echo "8. Initializing Prisma / Migrations..."
npx prisma generate
npx prisma migrate reset --force

# Create ecosystem.config.js to configure PM2
echo "9. Creating ecosystem.config.js..."
cat > ecosystem.config.js <<EOF
module.exports = {
  apps: [{
    name: "$APP_NAME",
    script: "dist/main.js",
    env: {
      NODE_ENV: "production",
      PG_CONNECTION_URL: "$PG_CONNECTION_URL",
      TELEGRAM_BOT_TOKEN: "$TELEGRAM_BOT_TOKEN",
      TELEGRAM_CHANNEL_ID: "$TELEGRAM_CHANNEL_ID",
      DOWNLOAD_DIRECTORY_PATH: "$DOWNLOAD_DIRECTORY_PATH"
    }
  }]
};
EOF

# Start app via PM2
echo "10. Starting app via PM2..."
pm2 delete "$APP_NAME" >/dev/null 2>&1 || true
pm2 start ecosystem.config.js --env production

# Configure PM2 startup
echo "11. Configuring PM2 startup..."
STARTUP_CMD=$(pm2 startup systemd -u pi --hp /home/pi | grep 'sudo' | tail -1)

if [ -n "$STARTUP_CMD" ]; then
  echo "Running: $STARTUP_CMD"
  eval $STARTUP_CMD
else
  echo "❌ Could not extract startup command from pm2"
fi

# Save PM2 config
pm2 save

# Enable autoload on OS start
sudo systemctl enable pm2-pi
sudo systemctl status pm2-pi --no-pager

echo "✅ Done! App $APP_NAME is running under PM2 and will auto-start after reboot."
