FROM node:18-alpine as backend_builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


# production builder

FROM node:18-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY --from=backend_builder /app/dist ./dist

RUN chown -R node:node /app && chmod -R 755 /app

RUN npm install pm2 -g

COPY ecosystem.config.js .


USER node 

# just expose for info.
EXPOSE 5000

CMD ["pm2-runtime" , "start" , "ecosystem.config.js"]