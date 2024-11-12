# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /src

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port Next.js runs on
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "dev"]
