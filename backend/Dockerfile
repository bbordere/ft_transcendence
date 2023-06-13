FROM debian:latest

RUN apt update ; apt upgrade -y ; \
	apt-get install -y procps; \
	apt install -y curl ;\
	curl -sL https://deb.nodesource.com/setup_18.x | bash ;\
	apt install -y nodejs
RUN npm i -g @nestjs/cli
RUN mkdir /workspace

WORKDIR /workspace

EXPOSE 3000
EXPOSE 5432

ENTRYPOINT [ "sh", "script.sh" ]