var doc = require('dynamodb-doc');
var crypto = require('crypto');

var dynamodb = new doc.DynamoDB();
var tableName = 'holiday-users'

var commonDebug = (event) => {
    var resultString = 'Method was: ' + event.httpMethod;
    resultString += ' path was: ' + event.path;
    if (event.pathParameters && event.pathParameters.userid){
        resultString += ' userid: ' + event.pathParameters.userid;
    }
    return resultString;
}

var makeDummyObject = (id) => {
    return {
        userid: id,
        email: 'dummy@dummy.com',
        forename: 'Forename',
        surname: 'Surname',
        created: 'today'
    };
}

/**
 * Tests string to only contain letters, ' and - and spaces, and should start
 * with letters.
 * Note this should be improved to support unicode characters
 */
var nameChecker = (str) => {
    return /^[a-zA-Z]+[a-zA-Z \-']+$/.test(str);
}

/**
 * Tests string to only contain hexadecimal characters
 */
var hashChecker = (str) => {
    return /^[abcdef0-9]+$/.test(str);
}

/**
 * Validates the inputs
 */
var validateNewUser = (data) => {
    var result = '';
    
    if (typeof data !== 'object'){
        return 'No data or wrong format';
    }
    if (typeof data.email !== 'string' || !data.email.length || data.email.indexOf('@') === -1){
        result = 'Missing email or wrong format';
    }
    if (typeof data.forename !== 'string' || !data.forename.length || !nameChecker(data.forename)){
        result += 'Missing forename or wrong format';
    }
    if (typeof data.surname !== 'string' || !data.surname.length || !nameChecker(data.forename)){
        result += 'Missing surname or wrong format';
    }
    if (result.length){
        return result;
    } else {
        return null;
    }
}

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
}

/**
 * Creates a new user from the input parameters
 */
var handlePOST = (event, result, context, callback) => {
    var submittedData = JSON.parse(event.body);
    //validate input data and send back error if malformed
    var validationResult = validateNewUser(submittedData);
    if(validationResult){
        result.body = validationResult;
        result.statusCode = 400;
        callback(null, result);
        return;
    }
    
    var newUser = userFromData(submittedData);

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
            }
            callback(null, result);
        }
    });
            
}

/**
 * Retrieves the user for the given id in json
 */ 
var handleGET = (event, result, context, callback) => {
    
}

exports.handler = (event, context, callback) => {
    console.log(commonDebug(event));
    var result = {
        'isBase64Encoded': false,
        'statusCode': 200,
        'headers': null,
        'body': null
    };
    
    switch(event.httpMethod){
        case "GET":
            result.body = JSON.stringify(makeDummyObject(event.pathParameters.userid));
            callback(null, result);
            break;
        case "PUT":
            result.body = "PUT unimplemented";
            callback(null, result);
            break;
        case "POST":
            handlePOST(event, result, context, callback);
            break;
        case "DELETE":
            result.body = "DELETE unimplemented";
            callback(null, result);
            break;
        default:
            result.statusCode = 504;
            callback(null, result);
    }
    
    
};