FROM node:18

WORKDIR /app

# Copy package.json first for better layer caching
COPY package.json .
RUN npm install

# Copy the rest of the source
COPY . .

EXPOSE 3000

CMD ["npm", "start"]