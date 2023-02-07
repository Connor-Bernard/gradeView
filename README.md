# GradeView Web Aplication

## About
This application was created using Node and React by Connor Bernard at the University of California, Berkeley for the sake of displaying student grade information for the classes CS10 "The Beauty and Joy of Computing" and CS61C "Great Ideas in Computer Architecture (Machine Structures)".

## SPREADSHEET SETUP
1. The first two columns should be Name and Email
2. The first row of the spreadsheet should be the titles of the homework assignemnts for that column

## Configuration
### SERVER CONFIG
1. Open the /server/config/default.json config file
2. Fill out the server section with the port of the API

<strong style='color:red'>NOTE: If your server address is different from your live website domain, you will have to update the proxy environment variable "REACT_APP_PROXY_SERVER" to reflect the correct proxy URL.</strong>

### SPREADSHEET CONFIG
1. Open the spreadsheet in google
2. Copy the section between /d/ and /edit (should be a long string of letters and numbers) to the id field of the spreadsheet section of the config file
3. Set the endcolumn field to the column that the grades end on
4. Set the pagename field to the name of the tab that has the grade data on it

### Google API Configuration
1. Go to "https://console.cloud.google.com/" and create a new project (top left)
2. Select the project and navigate to the "APIs & Services" section
3. Go to the Library tab an search "sheets"
4. Click on the "Google Sheets API" and enable the API
5. Go to the credentials tab (on APIs & Services)
6. Click create credentials on the top and create an OAuth Client ID
7. Select web application and name the client whatever you want
8. Add the web URL and port as well as the API url and port to both the Authorized Javascript origins as well as the Authorized redirect URIs
9. Copy the client ID in the top right to the config file
10. Go back to the credentials tab and create a new service account credential
11. Fill out the fields as necessary and create the account
12. Click on the account email under service accounts on the credentials page
13. Share the google sheet with the displayed email
14. Navigate to the keys section of the service account
15. Click "Add Key" and create a JSON key
16. Add this key to the credentials folder and update the link to the file in the config file

## Use
### WITH DOCKER
1. Navigate to the root directory
2. Build a dockerfile with "docker-compose build"
3. Run the dockerfile with "docker-compose start" (or "docker-compose up" to see console output in console)

### LOCALLY
1. Navigate to the server directory
2. run "npm start"

Note: Running these will start both a back-end node server as well as a front-end react website
