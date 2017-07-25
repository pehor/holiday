Users REST API implementation

**Backend**

Uses AWS Lambda serverless architecture, runs code in Node.js. 
API is exposed through AWS API Gateway.
Data is stored in AWS Dynamo DB, logs are saved in CloudWatch.

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

The API is currently available at
https://bepywqavse.execute-api.eu-west-2.amazonaws.com/prod/

**Frontend**

This a very simplistic webapp; Only to demonstrate usage of the api.

The frontend is served from S3

https://s3.eu-west-2.amazonaws.com/psys-holiday-users-ui/website/index.html

It can be used to query all the APIs of the backend.
It gives simple error messages for failed queries.
The webapp uses webpack to bundle the js and css files and to serve a local server for development. Javascript version is ES6.
Further improvements would entail minifying code, testing the backend, transpiling to es5 for compatibility, moving CDN libraries to be bundled too, changing to react, etc.
