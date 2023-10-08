FROM cimg/node:18.18.0-browsers

WORKDIR /usr/src/app/
USER root
COPY package.json ./
RUN yarn

COPY ./ ./

# RUN npm run test:all

# RUN npm run fetch:blocks

CMD ["npm", "run", "build"]
