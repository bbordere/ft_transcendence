FROM node:lts-alpine

VOLUME /frontend

WORKDIR /frontend

EXPOSE 8080

ENTRYPOINT [ "/bin/sh", "-c", "cd frontend && npm install && npm run dev" ]
