#!/bin/bash

msg="$(git log -1 --pretty=%B)"

githubPath="/home/etic/projets-commentaires/node-src"
rm -rf "$githubPath/*"
cp -r ./* "$githubPath/"
cd "$githubPath" && rm -rf node_modules && git add . && git commit -m "$msg" --author="Tuetuopay <tuetuopay@me.com>" && git push

