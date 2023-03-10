# GradeView Web Aplication

## About

This application was created using Node, Express, and React by Connor Bernard at the University of California, Berkeley for the sake of displaying student grade information for the classes CS10 "The Beauty and Joy of Computing" and CS61C "Great Ideas in Computer Architecture (Machine Structures)."

## SPREADSHEET SETUP

- The first column should be the student's name
- The second column should be the student's email
- The first row should be the titles of the homework assignemnts for that column
- The second row should be the type of assignment
- The third row should be the maximum amount of points the assignment is out of
- The bin page should have two columns and be ascending with the leftmost column being points and the rightmost being letter grade as shown below

![Picture of proper readme configuration](./readmeImages/binsFormat.png)

## Configuration

### SERVER CONFIG

1. Open the /api/config/default.json config file
2. Fill out the server section with the port of the API
3. Fill in the spreadhseet section with:
    1. The spreadsheet ID (found in the sheet URL)
    2. The scopes (only change this if the API needs more than readonly access)
4. Fill out the pages subsection of spreadsheet with:
    1. The gradepage (the page with the grade data on it) and:
        1. `pagename`: The name of the sheet with the grade data
        2. `assignmentMetaRow`: The row that the assignment metadata starts on
        3. `startrow`: The row where student information starts
        4. `startcol`: The column where student information starts
    2. The binpage (the page with the bins on it) and:
        1. `pagename`: the name of the page with the bins on it
        2. `startcell`: the top left cell of the bins (point value for F)
        3. `endcell`: the bottom right cell of the bins (letter value for A+)
5. Fill out the googleconfig section in accordance with [Google API configuration instructions](#google-api-configuration) below
6. Add all necessary admin emails to the admin whitelist

__NOTE: If your API server's origin is different from your live website's origin, you will have to set the `REACT_APP_PROXY_SERVER` environment variable equal to the respective URL in /website/.env.__

### Google API Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/) and create a new project (top left)
2. Select the project and navigate to the "APIs & Services" section
3. Go to the Library tab an search "sheets"
4. Click on the "Google Sheets API" and enable the API
5. Go to the credentials tab (on APIs & Services)
6. Click create credentials on the top and create an OAuth Client ID
7. Select web application and name the client whatever you want
8. Add the web URL and port as well as the API url and port to both the Authorized Javascript origins as well as the Authorized redirect URIs
9. Copy the client ID in the top right to the config file
10. Go back to the credentials tab and create a new service account credential
11. Fill out the fields as necessary and create the account (no need to add additional roles)
12. Click on the account email under service accounts on the credentials page
13. Share the google sheet with the displayed email
14. Navigate to the keys section of the service account
15. Click "Add Key" and create a JSON key
16. Create a .env file in /api/ if one doesn't already exist
17. Set the environment variable `SERVICE_ACCOUNT_CREDENTIALS` equal to the contents of this downloaded keyfile __NOTE: you will need to remove all new lines in this environment variable such that the environment variable declaration is in one line__

### CI/CD Configuration (optional)

1. Enable the [Cloud Build API](https://console.cloud.google.com/marketplace/product/google/cloudbuild.googleapis.com)
2. Enable [Cloud Run](https://console.cloud.google.com/marketplace/product/google-cloud-platform/cloud-run)
3. In the [Cloud Build Settings](https://console.cloud.google.com/cloud-build/settings/service-account?project) enable "Cloud Run Admin" and "Service Account User"
4. Go to [the credentials page](https://console.cloud.google.com/apis/credentials) and create a new service account using the "Create Credentials" button at the top of the screen
5. Fill out the basic information and give the service account access to the "Cloud Build Service Agent" role and the "Cloud Build Editor" role
6. Deploy the first build as explained [here](#manual-deployment) (this will succeed but will not properly load elements without correctly configuring the environment variables)
7. Enable the [Google Secret Manager API](https://console.cloud.google.com/security/secret-manager)
8. Create a new secret with the name "API_SERVICE_ACCOUNT" with the secret value of the API service account credentials downloaded in the keyfile during the [Google API Configuration step](#google-api-configuration) __SOURROUNDED IN SINGLE QUOTES__
9. Click on the API deployment in [Google Cloud Run](https://console.cloud.google.com/run) and then on the "EDIT & DEPLOY NEW REVISION" tab
10. Under Secrets, create a new secret and select the secret created above
11. Change the reference method from "Mounted as volume" to "Exposed as environment variable" and click Done
12. Deploy the change
13. Clop the URL from the deployment pannel of the API service
14. Click on the Web deployment in [Google Cloud Run](https://console.cloud.google.com/run) and then on the "EDIT & DEPLOY NEW REVISION" tab
15. Under "Environment variables" create a new variable with the name "REACT_APP_PROXY_SERVER" and value equal to the deployment URL found in step 12 and deploy this version

### GitLab Configuration (optional)

1. Create a new __private__ repo
2. Create a production branch off of the development branch (only necessary if development branch is public)
3. Add the Google Sheets api service account keyfile to /api/auth/ naming it in coordination with `googleconfig.service_account.keyfile` in /api/config/default.json
4. Forcefully add the keyfile
5. Commit and push to the keyfile and project to the new remote
6. Open your project on [GitLab](https://gitlab.com/) and navigate to settings > CI/CD
7. Expand the "Variables" tab
8. Click on "Add Variable" and set the key to `GCP_PROJECT_ID` and value to the project ID of the Google Cloud Project (can be found anywhere on [the google console dashboard](https://console.cloud.google.com/) by clicking the project name on the top).  This variable does not need to be protected or masked but must be able to be expanded
9. Go through the steps for [CI/CD Configuration](cicd-configuration-optional) and in [the credentials](console.cloud.google.com/apis/credentials) for your CI/CD service account, create a new key
10. Click on "Add Variable" and set the key to `GCP_SERVICE_ACCOUNT_KEY` and the value to the contents of the keyfle generated from the CI/CD service account

## Use

### LOCALLY WITH DOCKER

1. In the root directory run `make docker`

OR

1. Navigate to the root directory
2. Build a dockerfile with `docker-compose build`
3. Run the dockerfile with `docker-compose start` (or `docker-compose up` to see console output in console)

### LOCALLY WITH NODE

1. __[First use only]:__ In the root directory run `make init`
2. In the root directory run `make npm` to start the service

Note: Running these will start both an api server as well as a website

## CI/CD Deployment

### Setup

1. Create a GitLab project
2. Configure Google Cloud project as explained [here](#cicd-configuration-optional)
3. Configure GitLab project as explained [here](#gitlab-configuration-optional)

### Manual Deployment

1. Push to the new remote from the production branch with the option `ci-variable="PRODUCTION=true"`
eg: `git push production -o ci.variable="PRODUCTION=true"`

### Deployment with Make

1. Set the environment variable `PRODUCTION_REMOTE_NAME` equal to the name of the production remote (you can do this locally or in /.env)
2. Run the applicable command below:

    - Deploying from current branch: `make deployFromCurrentBranch`
    - Deploying from main branch: `make deployFromMain` (__WARNING:__ This command resets the production branch to the main branch; use with care)

### Note: The provided pipeline configuration relies on GitLab runners, so if a custom runner is preferred, it will have to be configured separately
