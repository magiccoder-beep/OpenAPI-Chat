# Use the official Node.js image as the base image
FROM node:20.5.1

# Set the working directory for the app
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies and ensure to rebuild any native modules
RUN npm install

# Copy the app's source code into the container
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]