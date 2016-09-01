#!/bin/bash

bower install

cd ./server/
../node_modules/.bin/tsd install
cd ..
cd ./public/
../node_modules/.bin/tsd install
cd ..

./node_modules/grunt-cli/bin/grunt default
