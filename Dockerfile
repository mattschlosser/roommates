FROM node:latest

WORKDIR /node
RUN npm install

CMD node . 
