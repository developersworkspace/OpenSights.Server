sudo apt-get update
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
npm install -g typescript
npm install -g gulp
git clone https://github.com/developersworkspace/OpenSights.Server.git
cd ./OpenSights.Server/api
npm install
gulp build
cd ./../
