# GradeView Web Aplication

## About

This application was created using Node, Express, and React by Connor Bernard at the University of California, Berkeley for the sake of displaying student grade information for the classes CS10 "The Beauty and Joy of Computing" and CS61C "Great Ideas in Computer Architecture (Machine Structures)."

## SPREADSHEET SETUP

1. The first two columns should be Name and Email
2. The first row of the spreadsheet should be the titles of the homework assignemnts for that column
3. The bin page should have two columns and be ascending with the leftmost column bein points and the rightmost being letter grade

## Configuration

### SERVER CONFIG

1. Open the /api/config/default.json config file
2. Fill out the server section with the port of the API
3. Fill in the spreadhseet section with:
    1. The spreadsheet ID (found in the sheet URL)
    2. The scopes (only change this if the API needs more than readonly access)
4. Fill out the pages subsection of spreadsheet with:
    1. The gradepage (the page with the grade data on it) and:
        1. pagename: The name of the sheet with the grade data
        2. maxrow: The row with the maximum points for each assignment
        3. startrow: The row where student information starts
        4. startcol: The column where student information starts
    2. The binpage (the page with the bins on it) and:
        1. pagename: the name of the page with the bins on it
        2. startcell: the top left cell of the bins (point value for F)
        3. endcell: the bottom right cell of the bins (letter value for A+)
5. Fill out the googleconfig section in accordance with [Google API configuration instructions](#google-api-configuration) below
6. Add all necessary admin emails to the admin whitelist

### SERVER CONFIG NOTES

* __If your server address is different from your live website domain, you will have to update the proxy environment variable found in /website/.env named "REACT_APP_PROXY_SERVER" to reflect the correct proxy URL.__

* __If you are running this using the default Dockerfiles and docker_compose file, you will also need to update the ports in the respective files for containerized deployment__

### Google API Configuration

1. Go to [Google Cloud Console]("https://console.cloud.google.com/") and create a new project (top left)
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
12. Click on the account email under service accounts on the credentials page (no need to relegate roles)
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

## CI/CD Deployment

1. Create a GitLab project
2. Add project remote to local git repository
3. Push to the new remote

### Note: The provided pipeline configuration relies on GitLab runners, so if a custom runner is preferred, it will have to be configured separately
