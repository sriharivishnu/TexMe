FROM ubuntu:16.04

LABEL MAINTAINER="srihari.vishnu@gmail.com" 

WORKDIR /usr/local/app
COPY ./install.sh .
RUN chmod +x install.sh && ./install.sh

COPY ./requirements.txt .
RUN apt-get update -y && apt-get install -y python-pip python-dev
RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

ENTRYPOINT [ "python" ]
CMD [ "application.py" ]
