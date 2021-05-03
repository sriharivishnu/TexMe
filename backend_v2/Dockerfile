FROM node:14

# Create app directory
WORKDIR /usr/src/app

COPY ./install.sh .
RUN chmod +x install.sh && ./install.sh

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start" ]