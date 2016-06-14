FROM nginx
MAINTAINER Alexis Bauvin <alexis.bauvin@telecom-paristech.fr>

EXPOSE 80

RUN mkdir /usr/share/nginx/config /usr/share/nginx/ssl && \
    chown root:root /usr/share/nginx/config /usr/share/nginx/ssl
VOLUME ["/usr/share/nginx/html", "/usr/share/nginx/config", "/usr/share/nginx/ssl"]

COPY default.conf /etc/nginx/conf.d/default.conf

