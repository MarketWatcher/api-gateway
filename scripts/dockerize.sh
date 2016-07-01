#!/bin/bash

DIR=`dirname $(readlink -f $0)`
OLDPWD=`pwd`

cd $DIR/../

docker login -u $DOCKER_USERNAME -e $DOCKER_EMAIL -p $DOCKER_PASSWORD
docker build -t thoughtworksturkey/marketwatcher-api-gateway .
docker push thoughtworksturkey/marketwatcher-api-gateway

cd $OLDPWD
