#!/bin/bash

echo "Cleaning public folder..."
rm -rf ./public/*

echo "Compiling TS..."
tsc

echo "Adding root files..."
rsync -a ./src/root/* ./public/

echo "Adding CSS..."
rsync -a ./src/ts/elements/*.css ./public/styles/