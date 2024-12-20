# Use a slim node image as the base
FROM node:18-slim

# Set the working directory to /usr/src/app
WORKDIR /usr/src/app

ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN apt-get update && apt-get install -y libgbm1

RUN apt-get update && apt-get install -y libasound2


# Install dependencies (including libraries for Chromium)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fontconfig \
    libx11-dev \
    libdrm2 \
    libx11-6 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libxss1 \
    libappindicator3-1 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libxshmfence1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

# Set Chromium executable path in environment variable for your application
ENV CHROME_BIN="/snap/chromium/current/usr/lib/chromium-browser/chrome"

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install npm dependencies
RUN npm install --production --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Expose the port the app will run on (assuming 80 for production environment)
EXPOSE 80

# Command to run your app
CMD ["npm", "start"]
