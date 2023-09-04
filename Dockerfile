FROM node:18

# Create app directory
RUN mkdir -p /app

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
RUN npm run dev

COPY . .

EXPOSE 3000 3001 3002
# CMD ["npm", "start"]
