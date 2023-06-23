FROM node:16.13.0
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y iputils-ping && \
    apt-get install -y telnet
RUN rm -rf ./*
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm install 
COPY . .
RUN mkdir -p /usr/src/app/public/videos
COPY wait-for-it.sh /usr/src/app/wait-for-it.sh
RUN chmod +x /usr/src/app/wait-for-it.sh
EXPOSE 3001
CMD ["npm", "run", "start"]