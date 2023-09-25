# Stage 1: Build the React frontend
FROM node:16 AS frontend-build

# Set the working directory for the frontend
WORKDIR /app/frontend

# Copy the frontend source code
COPY frontend/package*.json ./
COPY frontend/package-lock.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Node.js backend
FROM node:16 AS backend-build

# Set the working directory for the backend
WORKDIR /app/backend

# Copy the backend source code
COPY backend/package*.json ./
COPY backend/package-lock.json ./
# RUN npm install


COPY backend/ ./

# Install bcrypt with prebuilt binaries (compatible with the current architecture)
RUN npm install bcrypt

# Stage 3: Combine frontend and backend into a single image
FROM node:16

# Set the working directory for the combined app
WORKDIR /app

# Copy the built frontend and backend from previous stages
COPY --from=frontend-build /app/frontend/build ./frontend
COPY --from=backend-build /app/backend ./backend

# Copy the root-level package files
COPY package*.json ./
COPY package-lock.json ./

# Install production dependencies (remove development dependencies)
RUN npm install 

# Expose the ports
EXPOSE 3000 8000

# Define the command to start both the frontend and backend
CMD ["npm", "run", "start"]
