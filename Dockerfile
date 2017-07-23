# Container used at development of the website
# Leverages linux tools (note that this was running on win/powershell)
#
# To build the website with webpack
# docker run -it -v ${PWD}:/app -w /app/website devenv-holiday
# npm run build
# 
# To serve the website locally:
# docker run -it -v ${PWD}:/app -w /app/website -p 8080:8080 devenv-holiday
# 

FROM node:4

RUN apt-get update && apt-get install -y \
    apt-utils \
    bash \
    bash-completion \
    build-essential \
    curl \
    git \
    tar \
	vim \
	vim-common \
    zip

RUN git config --global user.email 'horvath.peter.hp@gmail.com'

COPY website/run_build.sh /run_build.sh
COPY website/package.json ./website/

#ENTRYPOINT /bin/bash /run_build.sh
RUN cd website && npm install
EXPOSE 8080
