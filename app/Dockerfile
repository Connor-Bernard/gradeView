# Use a base image that includes Python
FROM python:3.8-alpine

# Copy the Python script and other necessary files
COPY . /app
WORKDIR /app

# Install required Python packages
RUN pip install --no-cache-dir -r requirements.txt

# Start the Python script
CMD ["python", "-u", "app.py"]
