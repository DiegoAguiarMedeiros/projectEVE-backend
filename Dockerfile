# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN npm install
RUN npm run build


# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]