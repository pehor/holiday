var doc = require('dynamodb-doc');
var crypto = require('crypto');

var dynamodb = new doc.DynamoDB();
var tableName = 'holiday-users';

//defines the fields that can be set and updated for a user
var openFields = ['email', 'forename', 'surname'];

var commonDebug = (event) => {
    var resultString = 'Method was: ' + event.httpMethod;
    resultString += ' path was: ' + event.path;
    if (event.pathParameters && event.pathParameters.userid){
        resultString += ' userid: ' + event.pathParameters.userid;
    }
    return resultString;
};

var makeDummyObject = (id) => {
    return {
        userid: id,
        email: 'dummy@dummy.com',
        forename: 'Forename',
        surname: 'Surname',
        created: 'today'
    };
};

/**
 * Tests string to only contain letters, ' and - and spaces, and should start
 * with letters.
 * Note this should be improved to support unicode characters
 */
var nameChecker = (str) => {
    return /^[a-zA-Z]+[a-zA-Z \-']+$/.test(str);
};

/**
 * Tests string to only contain hexadecimal characters
 */
var hashChecker = (str) => {
    return /^[abcdef0-9]+$/.test(str);
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
            !data.email.length || data.email.indexOf('@') === -1){

            result = 'Bad email supplied ';
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
            !data.surname.length || !nameChecker(data.forename)){
    
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
            result.headers = {
                Location: event.path + '/' + newUser.userid
            };
            callback(null, result);
        }
    });
            
};

/**
 * Used to handle email query
 */
var handleNoId = (event, result, context, callback) => {
    var email = event.queryStringParameters.email;
    var params;
    if(email){
        
        //result.body = event.queryStringParameters.email;
        //callback(null, result);
        //return;
        
        params = {
            TableName : tabelName,
            KeyConditionExpression: "#em = :email",
            ExpressionAttributeNames:{
                "#em": "email"
            },
            ExpressionAttributeValues: {
                ":email": event.queryStringParameters.email
            }
        };

        dynamodb.query(params, (err, data) => {
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
                result.body = data.Items.length + '';
                //result.body = JSON.stringify(data.Items[0]);
                result.statusCode = 200;
                callback(null, result);
            }
        });
    } else {
        result.statusCode = 400;
        callback(null, result);
        return;
    }
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
    
}

exports.handler = (event, context, callback) => {
    //console.log(commonDebug(event));
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