FROM node:latest

RUN mkdir -p /opt/api-gateway

COPY package.json /opt/api-gateway
COPY users.js /opt/api-gateway
COPY src /opt/api-gateway/src
COPY conf /opt/api-gateway/conf
COPY node_modules /opt/api-gateway/node_modules

WORKDIR /opt/api-gateway/

EXPOSE 8000
ENTRYPOINT npm start
