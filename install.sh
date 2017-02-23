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
gulp build

# Change to root of repository
cd ./../

# Build and run docker compose as deamon
docker-compose up

# -- INSTALL NGINX --

# Update machine package indexes
sudo apt-get update

# Install NGINX
sudo apt-get install -y nginx

# Add rule to firewall
sudo ufw allow 'Nginx HTTP'

# Download nginx.conf to NGINX directory
sudo curl -o /etc/nginx/nginx.conf https://raw.githubusercontent.com/developersworkspace/WorldOfRations/master/nginx.conf

# Restart NGINX
sudo systemctl restart nginx
