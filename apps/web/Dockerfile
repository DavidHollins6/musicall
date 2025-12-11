FROM node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY . .

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]
