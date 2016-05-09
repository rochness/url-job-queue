#url-job-queue
A job queue whose workers fetch data from a URL and store the results in a database.
REST API is exposed for adding jobs and checking their status/results

Ex: User submits www.google.com to your endpoint.  The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result.  The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com

## To run:
1. Run npm install to install the dependencies.

2. MongoDB is used to store HTML for each url. In order to run the database, enter 'mongo' in the command line

3. From the root directory, run 'npm start' to run the server at localhost:3000

## Workers
The node-cron (https://github.com/ncb000gt/node-cron) module is used to schedule the workers. Currently the job is set to run every 5 minutes. The workers read from a text file in which every new line except for the first one has a URL to be fetched and the corresponding jobId for that URL. After the worker is done making a request to the URL and storing its HTML in the Mongo Database, it removes the corresponding lines from the text file.

