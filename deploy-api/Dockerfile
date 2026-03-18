FROM node:20

WORKDIR /app

# Copying both ensures npm install uses your exact versions
COPY package*.json ./

RUN npm install

COPY . .

# Cloud Run expects port 8080 by default
EXPOSE 8080

CMD ["node", "server.js"]