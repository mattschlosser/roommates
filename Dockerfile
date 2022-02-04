FROM node:latest

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV PATH /usr/src/node_modules/.bin:$PATH

ADD package.json /usr/src/package.json

RUN apt-get update && apt-get install build-essential python-is-python3 -y && npm install && apt-get remove build-essential python-is-python3 -y

CMD ["npm", "start"]
