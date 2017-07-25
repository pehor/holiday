const Backend = {};

(function() {
    const baseUrl = 'https://bepywqavse.execute-api.eu-west-2.amazonaws.com/prod/users';
    const baseProps = {
        contentType: 'application/json',
        dataType: 'json',
    }

    /**
     * Creates an error handler function that compiles the error messages
     * to one string param passed to an errorcallback
     */
    this.makeErrorHandler = function(errorCallback){
        return function(jqXHR, textStatus, errorThrown) {
            if(textStatus || errorThrown){
                console.log('Ajax error, textStatus:' + textStatus + ' errorThrown: ' + errorThrown);
                let result = textStatus;
                result = result || errorThrown;
                errorCallback(result);
                return;
            }

        }
    }

    /**
     * Retrieves all user ids from the database
     */
    this.getAllUsers = function(successCallback, errorCallback){
        //extend baseprops
        const props = Object.assign({}, baseProps, {
            url: baseUrl,
            type: 'GET',
            success: successCallback,
            error: this.makeErrorHandler(errorCallback)
        });
        $.ajax(props);
    };

    /**
     * Returns a record about the specified user
     *  successcallback takes the result body in a json
     */
    this.getUser = function(userid, successCallback, errorCallback){
        //extend baseprops
        const props = Object.assign({}, baseProps, {
            url: baseUrl + '/' + userid,
            type: 'GET',
            success: successCallback,
            error: this.makeErrorHandler(errorCallback)
        });
        $.ajax(props);
    };

    /**
     * Creates a new user in the database
     *  userData is an object containing email, forename, surname strings
     */
    this.createUser = function(userData, successCallback, errorCallback){
        //extend baseprops
        const props = Object.assign({}, baseProps, {
            url: baseUrl,
            type: 'POST',
            data: JSON.stringify(userData),
            //ajax still converts values to url params too...
            processData: false,
            success: successCallback,
            error: this.makeErrorHandler(errorCallback)
        });
        $.ajax(props);
    };

    /**
     * Modifies a user in the database
     *  userData is an object containing any of email, forename, surname strings
     */
    this.updateUser = function(userid, userData, successCallback, errorCallback){
        //extend baseprops
        const props = Object.assign({}, baseProps, {
            url: baseUrl + '/' + userid,
            type: 'PUT',
            dataType: 'text',
            data: JSON.stringify(userData),
            //ajax still converts values to url params too...
            processData: false,
            success: successCallback,
            error: this.makeErrorHandler(errorCallback)
        });
        $.ajax(props);
    };

    /**
     * Deletes the specified user from the database
     */
    this.deleteUser = function(userid, successCallback, errorCallback){
        //extend baseprops
        const props = Object.assign({}, baseProps, {
            url: baseUrl + '/' + userid,
            type: 'DELETE',
            dataType: 'text',
            success: successCallback,
            error: this.makeErrorHandler(errorCallback)
        });
        $.ajax(props);
    };
}).apply(Backend);

export default Backend;