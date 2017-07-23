Users REST API implementation

Backend

Uses AWS Lambda serverless architecture, runs code in Node.js. Logs are saved in CloudWatch.
API is exposed through AWS API Gateway.
Data is stored in AWS Dynamo DB.

Code was simple enough to be contained in one file.
Inputs are sanitized.
Testing is TODO.
Docker is only used for development.

A postman collection is provided to test the API.
Things to try:
- GET /users to list all user ids
- GET /users/{userid} to query the record for a specific user
- PUT /users/{userid} + body in raw (json) with any combination of the changeable parameters: email, surname, forename to modify the user
- DELETE /users/{userid} to delete the user
- POST /users  + body in raw (json) with all of the parameters: email, surname, forename to create the user - will return the new record and the url users/{userid} in a location header

Response codes and errors are implemented. 


