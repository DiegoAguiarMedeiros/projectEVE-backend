FROM node:18

WORKDIR /usr/src/app

COPY . .
COPY ./.env.template ./.env
RUN echo "npm install"
RUN npm install
RUN echo "npm run docker:up"
RUN npm run docker:up

EXPOSE 3000

COPY start.sh /usr/src/app/start.sh
CMD ["sh", "/usr/src/app/start.sh"]