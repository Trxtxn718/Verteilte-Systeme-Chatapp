# FROM node:lts-alpine

# WORKDIR /usr/src/app

# COPY . /usr/src/app

# RUN npm install -g @angular/cli

# RUN npm install

# EXPOSE 4200

# CMD ["ng", "serve", "--host", "0.0.0.0"]


# Stage 1: Build
FROM node:20 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . /app
ARG configuration=production
RUN npm run build -- --configuration=${configuration}

# Stage 2: Production with Nginx
FROM nginx
COPY --from=build /app/dist/out/browser /usr/share/nginx/html
COPY /nginx-custom.conf /etc/nginx/conf.d/default.conf
