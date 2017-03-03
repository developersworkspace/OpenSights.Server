# -- BUILD AND INSTALL OpenSights.Server --

# Update machine package indexes
sudo apt-get update

# Download and run script to install node 7
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -

# Install node 7
sudo apt-get install -y nodejs

# Install 'typescript' node package
npm install -g typescript

# Install 'gulp' node package
npm install -g gulp

# Clone 'OpenSights.Server.' repository
git clone https://github.com/developersworkspace/OpenSights.Server.git

# Change directory to 'api'
cd ./OpenSights.Server/api

# Install node packages for 'api'
npm install

# Build 'api'
npm run build

# Change to root of repository
cd ./../

# Build and run docker compose as deamon
docker-compose up -d

# -- INSTALL SSL CERT --

# Update machine package indexes
sudo apt-get update

# Open 443 port
sudo ufw allow 443/tcp

# Install Let's Encrypt cli
sudo apt-get install -y letsencrypt

# Obtain SSL CERT
sudo letsencrypt certonly --agree-tos --standalone --email developersworkspace@gmail.com -d opensights.developersworkspace.co.za

# -- INSTALL NGINX --

# Update machine package indexes
sudo apt-get update

# Install NGINX
sudo apt-get install -y nginx

# Add rule to firewall
sudo ufw allow 'Nginx HTTP'

# Download nginx.conf to NGINX directory
sudo curl -o /etc/nginx/nginx.conf https://raw.githubusercontent.com/developersworkspace/OpenSights.Server/master/nginx.conf

# Restart NGINX
sudo systemctl restart nginx
