# Use the official Node.js image from Docker Hub
FROM node:14

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install the dependencies inside the container
RUN npm install

# Copy all project files into the container
COPY . .

# Expose the port that the app will run on (adjust if your app uses a different port)
EXPOSE 3000

# Define the command to run your app
CMD ["npm", "start"]
