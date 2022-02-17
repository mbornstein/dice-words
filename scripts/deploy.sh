#!/bin/bash

TARGET=$1
CURPATH=$(pwd)

rm -r "$TARGET"
mv build "$TARGET"
cd "$TARGET"
git add .
git commit -m "deploy scrabble"
git push
cd "$CURPATH"