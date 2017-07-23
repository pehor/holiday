/**
 * Node.js server code running in AWS lambda
 * Implementing a REST API for user data
 * Triggered by API Gateway
 * Storing user data in Dynamo DB
 * 
 * Handles:
 * /users
 *     GET - list all user ids
 *     POST + JSON in body - creates new user
 *     /{userid}
 *         GET - returns user record
 *         PUT + JSON in body - modifies user record
 *         DELETE - deletes user record
 * 
 */
var doc = require('dynamodb-doc');
var crypto = require('crypto');

var dynamodb = new doc.DynamoDB();
var tableName = 'holiday-users';

//defines the fields that can be set and updated for a user
var openFields = ['email', 'forename', 'surname'];

/**
 * Tests string to only contain letters, ' and - and spaces, and should start
 * with letters.
 * Note this should be improved to support unicode characters
 */
var nameChecker = (str) => {
    if(str.length > 254){
        return false;
    }
    return /^[a-zA-Z]+[a-zA-Z \-']+$/.test(str);
};

/**
 * Tests for valid email format
 */
var emailChecker = (str) => {
    var checker = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-?\.?[a-zA-Z0-9])*(\.[a-zA-Z](-?[a-zA-Z0-9])*)+$/;
    var parts;
    var domainParts;
    
    if(str.length > 254){
        return false;
    }
    if(!checker.test(str)){
        return false;
    }
    
    parts = str.split("@");
    if(parts[0].length > 64){
        return false;
    }
    
    domainParts = parts[1].split(".");
    if(domainParts.some((part) => part.length > 63)) return false;
    
    return true;
}

/**
 * Tests string to only contain hexadecimal characters
 */
var hashChecker = (str) => {
    return /^[abcdef0-9]{32}$/.test(str);
};

/**
 * Checks for valid id. Returns true for valid, false for invalid.
 */
var validateHash = (event) => {
    //check for valid id
    return typeof event.pathParameters === 'object' && 
        typeof event.pathParameters.userid === 'string' &&
        hashChecker(event.pathParameters.userid);
};

/**
 * Validates the input for a user
 * if needAll is true, presence will be enforced
 */
var validateUserData = (data, needAll) => {
    var result = '';
    
    if (typeof data !== 'object'){
        return 'No data or wrong format';
    }
    if (data.email || needAll){
        if (typeof data.email !== 'string' ||
            !data.email.length || !emailChecker(data.email)){

            result += 'Bad email supplied ';
        }
    }
    if (data.forename || needAll){
        if (typeof data.forename !== 'string' ||
            !data.forename.length || !nameChecker(data.forename)){
    
            result += 'Bad forename supplied ';
        }
    }
    if (data.surname || needAll){
        if (typeof data.surname !== 'string' ||
            !data.surname.length || !nameChecker(data.surname)){
    
            result += 'Bad surname supplied';
        }
    }
    if (result.length){
        return result;
    } else {
        return null;
    }
};

/**
 * Creates a new user object from the submitted data.
 * Adds a hash as a unique id.
 */
var userFromData = (data) => {
    var date = new Date().toString();
    // create a hash as a unique id
    var md5sum = crypto.createHash('md5').update(data.email + date).digest('hex');
    
    return {
        userid: md5sum,
        email: data.email,
        forename: data.forename,
        surname: data.surname,
        created: date
    };
};

/**
 * Creates a new user from the input parameters
 * POST /users
 * body {
 *   "email": "email@random.com",
 *   "forename": "Forename",
 *   "surname": "Surname"
 * }
 */
var handlePOST = (event, result, context, callback) => {
    var submittedData = JSON.parse(event.body);
    //validate input data and send back error if malformed
    var validationResult = validateUserData(submittedData, true);
    var newUser;
    
    if(validationResult){
        result.body = validationResult;
        result.statusCode = 400;
        callback(null, result);
        return;
    }
    
    newUser = userFromData(submittedData);

    dynamodb.putItem({
        "TableName": tableName,
        "Item" : newUser
    }, (err, data) => {
        if (err) {
            console.error('Error putting item into dynamodb: ' + err);
            result.body = 'Error putting item into dynamodb: ' + err;
            result.statusCode = 500;
            callback(null, result);
        }
        else {
            console.log('success: ' + JSON.stringify(data, null, '  '));
            result.body = 'Added new user to dynamo: ' + JSON.stringify(newUser);
            result.statusCode = 201;
            //returning a Location header with a url to the new item
            result.headers = {
                Location: event.path + '/' + newUser.userid
            };
            callback(null, result);
        }
    });
};

/**
 * Used to handle listing users. Returns the list of userids in the db
 * Note that this is for convenience and in the context of this assignment,
 * a real system would likely not expose this publicly
 * 
 * GET /users
 * 
 */
var handleNoId = (event, result, context, callback) => {
    //return all items in dynamo
    dynamodb.scan({
        TableName: tableName
    }, (err, data) => {
        var keys = [];
        var i;
        if (err) {
            console.error('Error getting item from dynamodb: ' + err);
            result.body = 'Error getting item from dynamodb: ' + err;
            result.statusCode = 500;
            callback(null, result);
        }
        else {
            console.log('success: ' + JSON.stringify(data, null, '  '));
            //handle not found
            if (!data.Items.length){
                result.statusCode = 404;
                callback(null, result);
                return;
            }
            //extract all userids
            for (i = 0; i < data.Items.length; ++i){
                keys[i] = data.Items[i].userid;
            }
            result.body = JSON.stringify(keys);
            result.statusCode = 200;
            callback(null, result);
        }
    });
};

/**
 * Retrieves the user for the given id in json
 * GET /users/<userid>
 */ 
var handleGET = (event, result, context, callback) => {
    //handle no id - list all
    if (event.path === '/users'){
        handleNoId(event, result, context, callback);
        return;
    }

    //check for valid id
    if (!validateHash(event)){
        result.statusCode = 400;
        callback(null, result);
    }
    
    //fetch from dynamo
    dynamodb.getItem({
        "TableName": tableName,
        "Key" : {
            userid: event.pathParameters.userid
        }
    }, (err, data) => {
        if (err) {
            console.error('Error getting item from dynamodb: ' + err);
            result.body = 'Error getting item from dynamodb: ' + err;
            result.statusCode = 500;
            callback(null, result);
        }
        else {
            console.log('success: ' + JSON.stringify(data, null, '  '));
            //handle not found
            if (!Object.keys(data).length){
                result.statusCode = 404;
                callback(null, result);
                return;
            }
            result.body = JSON.stringify(data.Item);
            result.statusCode = 200;
            callback(null, result);
        }
    });
};

/**
 * Updates the user's attributes
 * PUT /users/<userid>
 * 
 * all fields are optional in body:
 * body {
 *   "email": "email@random.com",
 *   "forename": "Forename",
 *   "surname": "Surname"
 * }
 */ 
var handlePUT = (event, result, context, callback) => {
    var submittedData;
    var validationResult;
    var updates;
    var i;

    //check for valid id
    if (!validateHash(event)){
        result.statusCode = 400;
        callback(null, result);
    }
    
    submittedData = JSON.parse(event.body);
    //validate input data and send back error if malformed
    validationResult = validateUserData(submittedData, false);

    if(validationResult){
        result.body = validationResult;
        result.statusCode = 400;
        callback(null, result);
        return;
    }
    
    //create updates object for db update
    updates = {};
    for (i = 0; i < openFields.length; ++i){
        if (submittedData[openFields[i]]){
            updates[openFields[i]] = {
                Action: 'PUT',
                Value: submittedData[openFields[i]]
            }
        }
    }
    
    //if no updates, we are finished
    if (!Object.keys(updates).length){
        result.statusCode = 200;
        callback(null, result);
        return;
    }
    
    //update dynamo
    dynamodb.updateItem({
        "TableName": tableName,
        "Key": {
            userid: event.pathParameters.userid
        },
        AttributeUpdates: updates
    }, (err, data) => {
        if (err) {
            console.error('Error updating item in dynamodb: ' + err);
            result.body = 'Error updating item in dynamodb: ' + err;
            result.statusCode = 500;
            callback(null, result);
        }
        else {
            console.log('success: ' + JSON.stringify(data, null, '  '));
            result.body = JSON.stringify(data.Item);
            result.statusCode = 200;
            callback(null, result);
        }
    });
    
};

/**
 * Handles deleting users for a given id
 * DELETE /users/<userid>
 * 
 * Will return 200 on deleting non-existing records
 */ 
var handleDELETE = (event, result, context, callback) => {
    //check for valid id
    if (!validateHash(event)){
        result.statusCode = 400;
        callback(null, result);
    }
    
    //delete from dynamo
    dynamodb.deleteItem({
        "TableName": tableName,
        "Key": {
            userid: event.pathParameters.userid
        }
    }, (err, data) => {
        if (err) {
            console.error('Error deleting item from dynamodb: ' + err);
            result.body = 'Error deleting item from dynamodb: ' + err;
            result.statusCode = 500;
            callback(null, result);
        }
        else {
            console.log('success: ' + JSON.stringify(data, null, '  '));
            result.body = JSON.stringify(data.Item);
            result.statusCode = 200;
            callback(null, result);
        }
    });
    
};

/**
 * The entrypoint, handling all requests and dispatching to functions
 */
exports.handler = (event, context, callback) => {
    var result = {
        'isBase64Encoded': false,
        'statusCode': 200,
        'headers': null,
        'body': null
    };
    
    switch(event.httpMethod){
        case "GET":
            handleGET(event, result, context, callback);
            break;
        case "PUT":
            handlePUT(event, result, context, callback);
            break;
        case "POST":
            handlePOST(event, result, context, callback);
            break;
        case "DELETE":
            handleDELETE(event, result, context, callback);
            break;
        default:
            result.statusCode = 504;
            callback(null, result);
    }
};
