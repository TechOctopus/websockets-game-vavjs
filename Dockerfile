FROM node:23

WORKDIR /app

COPY ./package.json .

RUN npm install

COPY . .

EXPOSE 8080
EXPOSE 8082

CMD ["npm", "start"]
