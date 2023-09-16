FROM node:16

LABEL version="1.0"
LABEL description="Docker Backend for MagicxGame Admin."
LABEL maintainer = ["vaaiibhav@live.com"]

WORKDIR /app/backend

COPY ["package.json", "package-lock.json", "./backend/"]
RUN npm install 
COPY ./backend ./backend

EXPOSE 8000
RUN npm start
WORKDIR /app/frontend
COPY ["package.json", "package-lock.json", "./frontend/"]

RUN npm install 

COPY ./frontend ./frontend

EXPOSE 3000

CMD ["npm", "start"]