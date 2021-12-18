#!/bin/bash

echo "Cleaning public folder..."
rm -rf ./public/*

echo "Compiling frontend TS..."
cd ./frontend
tsc

echo "Adding root files..."
rsync -a ./src/root/* ../public/

echo "Adding CSS..."
rsync -a ./src/ts/elements/*.css ../public/styles/

echo "Done!"
cd ..