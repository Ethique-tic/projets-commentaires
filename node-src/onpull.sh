#!/bin/bash

# Force nodemon to restart the node server
touch app.js

msg="$(git log -1 --pretty=%B)"
echo -e "$msg"

githubPath="/home/etic/projets-commentaires/node-src"
rm -rf "$githubPath/*"
cp -r ./* "$githubPath/"
cd "$githubPath" && rm -rf node_modules && git add . && git commit -m "$msg" --author="Tuetuopay <tuetuopay@me.com>" && git push

