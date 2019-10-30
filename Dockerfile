FROM ubuntu
MAINTAINER Vinicius Emanoel Andrade "viniciusemanoelandrade@hotmail.com"

RUN apt-get update && apt-get install -y python3 python3-pip

EXPOSE 5000

COPY . /var/www/app
WORKDIR /var/www/app
RUN pip3 install flask numpy
ENTRYPOINT ["python3"]
CMD ["run.py"]
