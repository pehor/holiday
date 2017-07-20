# Usage:
#
# # Assemble the dev environment. This is slow the first time.
# docker build -t devenv-holiday .
# Mount and run (powershell)
# docker run -it -v ${PWD}:/app -w /app devenv-holiday

FROM debian:jessie

RUN apt-get update && apt-get install -y \
    apt-utils \
    bash-completion \
    build-essential \
    curl \
    git \
    tar \
	vim \
	vim-common \
    zip \
    python-pip \
    && pip install awscli

RUN git config --global user.email 'horvath.peter.hp@gmail.com'

