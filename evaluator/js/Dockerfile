# FROM node:16-alpine

# WORKDIR /app

# COPY run.js .
# COPY code.js .
# COPY input.txt .

# CMD ["node", "run.js"]


# FROM node:16

# WORKDIR /app

# COPY code.js /app/code.js
# COPY input.txt /app/input.txt
# COPY run.js /app/run.js

# CMD ["node", "run.js"]

FROM node:16

WORKDIR /app

COPY run.js .

CMD ["node", "run.js"]
