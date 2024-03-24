FROM nginx:latest
ADD dist/ /usr/share/nginx/html
ADD default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD service nginx start