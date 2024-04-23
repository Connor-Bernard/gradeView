# Use a base image that includes Python
FROM python:3.8-slim

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy the Python script and other necessary files
WORKDIR /dbcron
COPY . /dbcron

# Install required Python packages
RUN pip install --no-cache-dir -r requirements.txt


RUN chmod +x manual_update_flush.py

# Prepare the cron job
COPY cronjob /etc/cron.d/cronjob
RUN chmod 0644 /etc/cron.d/cronjob
RUN crontab /etc/cron.d/cronjob

# Create the log file to be able to run tail on it and see cron job logs
RUN touch /var/log/cron.log

# Start cron in the foreground and tail the log file
CMD ["sh", "-c", "python manual_update_flush.py && cron -f & tail -f /var/log/cron.log"]
