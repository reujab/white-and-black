FROM golang:1.22-alpine as backendbuilder

ENV BUILD_DIR /build

COPY backend $BUILD_DIR/
COPY cards $BUILD_DIR/cards

WORKDIR $BUILD_DIR
RUN ls -l
RUN go build -o /dist/backend

FROM node:lts-alpine as frontendbuilder

ENV BUILD_DIR /build

COPY frontend $BUILD_DIR/
COPY cards $BUILD_DIR/cards

WORKDIR $BUILD_DIR
RUN apk add python3 make g++ util-linux
RUN ls -l
RUN npm install
RUN npm run build

FROM alpine:latest

RUN mkdir /app
COPY --from=backendbuilder /dist/backend /app/
COPY --from=frontendbuilder /build/dist /app/dist
COPY cards /app/cards

WORKDIR /app
# create least privileged user and use it
RUN adduser --disabled-password --gecos '' user-app
USER user-app

EXPOSE 8080
CMD ["./backend"]
