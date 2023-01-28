# GradeView Web Aplication

## About
This application was created by Connor Bernard at the University of California, Berkeley for the sake of displaying student grade information.

## Configuration
### -- SERVER SETUP --
1. Open server.js in the server folder of the root directory
2. Fill out the constants as documented in the file
3. Run the web app

### -- IF API HAS A DIFFERENT ROOT URL -- 
1. Update the respective fields in the above file
2. Update the proxy server in the package.json in the root directory
3. Update the constant in the api.js file of the utils folder in the root directory

## Use
### -- WITH DOCKER --
1. Navigate to the root directory
2. Build a dockerfile with "docker-compose build"
3. Run the dockerfile with "docker-compose start" (or "docker-compose up" to see console output in console)

### -- LOCALLY --
1. Navigate to the root directory
2. run "npm start"

Note: Running these will start both a back-end node server as well as a front-end react website