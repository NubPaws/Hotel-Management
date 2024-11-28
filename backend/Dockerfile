# backend/Dockerfile

FROM node:20-alpine

# Sets the working directory.
WORKDIR /usr/src/backend

# Copies the package files.
COPY package*.json ./

# Installs npm dependencies.
RUN npm install

# Copies the rest of the files.
COPY . .

# Builds the project.
RUN npm run build

# Expose a port
EXPOSE 8000

# Start the application
CMD ["npm", "run", "start"]
