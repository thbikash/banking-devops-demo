#!/bin/bash

IMAGE=bikashth/banking-app
VERSION=latest   # or 1.0.23 for rollback

docker pull $IMAGE:$VERSION

docker stop banking-app || true
docker rm banking-app || true

docker run -d \
  --name banking-app \
  -p 8080:8080 \
  $IMAGE:$VERSION
