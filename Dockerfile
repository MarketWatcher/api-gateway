FROM node:latest

RUN mkdir -p /opt/api-gateway

COPY package.json /opt/api-gateway/package.json
COPY users.js /opt/api-gateway/users/js
COPY src /opt/api-gateway/src
COPY conf /opt/api-gateway/conf
COPY conf/app.json-PRODUCTION /opt/api-gateway/conf/app.json
COPY node_modules /opt/api-gateway/node_modules

WORKDIR /opt/api-gateway/

EXPOSE 8000
ENTRYPOINT npm start
