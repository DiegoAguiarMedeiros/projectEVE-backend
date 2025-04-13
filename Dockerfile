FROM node:23

WORKDIR /usr/src/app

COPY . .
COPY ./.env.template ./.env

RUN npm install
RUN npm run build

EXPOSE 3000

COPY start.sh /usr/src/app/start.sh
CMD ["sh", "/usr/src/app/start.sh"]