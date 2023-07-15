FROM node:16.13.0
WORKDIR /usr/src/app
RUN apt-get update && \
    apt-get install -y iputils-ping
RUN rm -rf ./*
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3002
CMD ["npm", "run", "start"]