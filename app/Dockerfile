# Use a base image that includes Python
FROM python:3.8

# Install cron
RUN apt-get update && apt-get install -y cron

# Copy the Python script and other necessary files
COPY . /app
WORKDIR /app

# Install required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Add the cron job (assuming you have a file named 'crontab')
COPY crontab /etc/cron.d/update-cron
RUN chmod 0644 /etc/cron.d/update-cron

# Create a log file to store cron job logs (optional)
RUN touch /var/log/cron.log

# Run the cron job and tail the log file
CMD cron && tail -f /var/log/cron.log

