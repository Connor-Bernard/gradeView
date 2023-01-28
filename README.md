# GradeView Web Aplication

## About
This application was created using Node and React by Connor Bernard at the University of California, Berkeley for the sake of displaying student grade information for the classes CS10 "The Beauty and Joy of Computing" and CS61C "Great Ideas in Computer Architecture (Machine Structures)".

## Configuration
### -- SERVER SETUP --
1. Fill out the default.json file in the config folder of the server

### -- IF API HAS A DIFFERENT ROOT URL -- 
1. Update the respective fields in the above file
2. Update the proxy field in the package.json (in the root directory) to reflect the server specified in server.js

## -- SPREADSHEET CONFIG --
1. This works off of the HAID tab of the spreadsheet
2. If you are an admin you cannot be in the list of students taking the class
3. The second column of the spreadsheet should be the user's email
4. The student information should start on the second row of the spreadsheet

## Use
### -- WITH DOCKER --
1. Navigate to the root directory
2. Build a dockerfile with "docker-compose build"
3. Run the dockerfile with "docker-compose start" (or "docker-compose up" to see console output in console)

### -- LOCALLY --
1. Navigate to the root directory
2. run "npm start"

Note: Running these will start both a back-end node server as well as a front-end react website
