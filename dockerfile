FROM node:18-alpine

WORKDIR /app

# Set working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy files to directory
COPY . .

EXPOSE ${PORT}

# Install pm2
RUN npm i pm2 -g

RUN npm run build

# Start app
CMD ["pm2-runtime","start","pm2.json"]
