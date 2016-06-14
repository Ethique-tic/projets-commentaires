# nodejs-server

FROM node
MAINTAINER	Alexis Bauvin <alexis.bauvin@telecom-paristech.fr>

# Install nodemon
RUN npm install -g nodemon

# HTTP Port the server may expose
EXPOSE 80

# === Data folders ===
VOLUME ["/usr/src/app/"]

CMD ["sh", "-c", "cd /usr/src/app && npm start"]
