# Use the official Node.js 18 image as a base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the working directory
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port Next.js will run on
EXPOSE 3010

# Build the Next.js application
RUN npm run build

# Command to run the Next.js application
CMD ["npm", "start"]