FROM node:14

#ENV VARIABLES
ENV PORT=9091
ENV BASE_URL=http://3.15.140.59:8080/auth
ENV REALM_NAME=master
ENV DB_HOST=mongodb-container
ENV DB_NAME=database

#CREATING WORK DIR
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

#COPYING FILES TO WORKDIR AND INSTALLING DEPENDENCIES
COPY package.json .
RUN npm install
ADD . /usr/src/app

#EXPOSING PORT
EXPOSE 9091

#STARTING APP
CMD [ "npm", "start" ]