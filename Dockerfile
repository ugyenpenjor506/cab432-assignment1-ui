# Stage 1: Build the React app
FROM node:16 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Stage 2: Serve the React app using nginx
FROM nginx:alpine


COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]




