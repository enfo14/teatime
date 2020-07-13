FROM node:12.18-stretch AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json angular.json tsconfig.app.json tsconfig.json ./
RUN npm install
COPY src src
RUN npm run build

FROM nginx:stable
COPY --from=build /usr/src/app/dist/teatime /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/nginx.conf
