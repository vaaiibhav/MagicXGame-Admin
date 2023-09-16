FROM node:16

LABEL version="1.0"
LABEL description="Docker Backend for MagicxGame Admin."
LABEL maintainer = ["vaaiibhav@live.com"]

WORKDIR /app/backend

COPY ["backend/package.json", "backend/package-lock.json", "backend/"]
RUN npm install 

EXPOSE 8000
RUN npm start
WORKDIR /app/frontend
COPY ["frontend/package.json", "frontend/package-lock.json", "frontend/"]

RUN npm install 


EXPOSE 3000

CMD ["npm", "start"]