# Use the official Node.js image as the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the entire project directory
COPY . .

# Expose the port that your application will run on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

