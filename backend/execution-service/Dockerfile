FROM node:20-alpine

# Install g++ (C++), Java JDK, and Python3
RUN apk add --no-cache build-base openjdk21-jdk python3

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Ensure temp directory exists and has correct permissions
RUN mkdir -p temp && chmod 777 temp

EXPOSE 5000

CMD ["npm", "start"]
