# frontend/Dockerfile

FROM node:20-alpine

# Install a simple HTTP server to serve the static files
RUN npm install -g http-server

# Sets the working directory.
WORKDIR /usr/src/frontend
# Copies the package files.
COPY package*.json ./

# Installs npm dependencies.
RUN npm install

# Copies the rest of the files.
COPY . .

# Builds the project.
ARG VITE_BACKEND_ADDRESS
ENV VITE_BACKEND_ADDRESS=${VITE_BACKEND_ADDRESS}
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the HTTP server
CMD ["http-server", "dist", "-p", "3000"]