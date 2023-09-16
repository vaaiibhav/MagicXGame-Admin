FROM node:16

LABEL version="1.0"
LABEL description="Docker Frontend for MagicxGame Admin."
LABEL maintainer = ["vaaiibhav@live.com"]

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

RUN npm install 

COPY . .

EXPOSE 3000

CMD ["npm", "start"]