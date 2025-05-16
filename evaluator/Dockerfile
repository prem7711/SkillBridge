# evaluator/Dockerfile

FROM node:18

# Install docker CLI
RUN apt-get update && \
    apt-get install -y docker.io

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy rest of the files
COPY . .

# Expose the evaluator server port
EXPOSE 5005

# Start the evaluator service
CMD ["node", "run.js"]
