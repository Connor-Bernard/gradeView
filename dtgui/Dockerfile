FROM tiangolo/uwsgi-nginx:python3.11
ENV LISTEN_PORT 8080
WORKDIR /app
COPY . /app
RUN apt-get update && apt-get install graphviz -y
RUN pip install --no-cache-dir --upgrade -r requirements.txt
EXPOSE 8080