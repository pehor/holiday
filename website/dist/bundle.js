/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/assets/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

/* harmony default export */ __webpack_exports__["a"] = (Backend);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const FEEDBACKICONS = {
    valid: 'glyphicon glyphicon-ok',
    invalid: 'glyphicon glyphicon-remove',
    validating: 'glyphicon glyphicon-refresh'
};

/* harmony default export */ __webpack_exports__["a"] = (FEEDBACKICONS);

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(3);


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__backend__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__getallusers__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__getuser__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__createuser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__updateuser__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__deleteuser__ = __webpack_require__(8);








(function(){
    $( document ).ready(function() {

        __WEBPACK_IMPORTED_MODULE_1__getallusers__["a" /* default */].setupAction();

        __WEBPACK_IMPORTED_MODULE_2__getuser__["a" /* default */].setupValidation();
        __WEBPACK_IMPORTED_MODULE_2__getuser__["a" /* default */].setupAction();

        __WEBPACK_IMPORTED_MODULE_3__createuser__["a" /* default */].setupValidation();
        __WEBPACK_IMPORTED_MODULE_3__createuser__["a" /* default */].setupAction();

        __WEBPACK_IMPORTED_MODULE_4__updateuser__["a" /* default */].setupValidation();
        __WEBPACK_IMPORTED_MODULE_4__updateuser__["a" /* default */].setupAction();

        __WEBPACK_IMPORTED_MODULE_5__deleteuser__["a" /* default */].setupValidation();
        __WEBPACK_IMPORTED_MODULE_5__deleteuser__["a" /* default */].setupAction();
    });
}());



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feedbackicons__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend__ = __webpack_require__(0);



const GetAllUsers = {};

(function() {
    this.setupAction = function(){
        $('#content-all-ids button').click((e)=>{
            __WEBPACK_IMPORTED_MODULE_1__backend__["a" /* default */].getAllUsers(
                //success
                (result)=>{
                    let str = '';
                    if(Array.isArray(result)){
                        result.forEach((r)=>{
                            str += r + '\n'
                        });
                    } else {
                        str = 'parsing error';
                    }
                    $('#content-all-ids .result').text(str);
                },
                //error
                (result)=>{
                    $('#content-all-ids .result').text(result);
                }
            );
        });
    }
}).apply(GetAllUsers);

/* harmony default export */ __webpack_exports__["a"] = (GetAllUsers);

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feedbackicons__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend__ = __webpack_require__(0);



const GetUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-get-user form').bootstrapValidator({
            feedbackIcons: __WEBPACK_IMPORTED_MODULE_0__feedbackicons__["a" /* default */],
            fields: {
                getuseruserid: {
                    validators: {
                        notEmpty: {
                            message: 'User ID is required'
                        }
                    }
                }
            }
        });
    }

    this.setupAction = function(){
        $('#content-get-user button').click((e)=>{
            const bootstrapValidator = $('#content-get-user form').data('bootstrapValidator');
            if(bootstrapValidator.isValid()){
                __WEBPACK_IMPORTED_MODULE_1__backend__["a" /* default */].getUser(
                    //userid
                    $('#get-user-userid').val().trim(),
                    //success
                    (result)=>{
                        let str = '';
                        Object.keys(result).forEach((k)=>{
                            str += k + ': ' + result[k] + "\n";
                        })
                        $('#content-get-user .result').text(str);
                    },
                    //error
                    (result)=>{
                        $('#content-get-user .result').text(result);
                    },
                );
                e.preventDefault();
            }
        });
    }
}).apply(GetUser);

/* harmony default export */ __webpack_exports__["a"] = (GetUser);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feedbackicons__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend__ = __webpack_require__(0);



const CreateUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-create-user form').bootstrapValidator({
            feedbackIcons: __WEBPACK_IMPORTED_MODULE_0__feedbackicons__["a" /* default */],
            fields: {
                createuseremail: {
                    validators: {
                        notEmpty: {
                            message: 'Email is required'
                        }
                    }
                },
                createuserforename: {
                    validators: {
                        notEmpty: {
                            message: 'Forename is required'
                        }
                    }
                },
                createusersurname: {
                    validators: {
                        notEmpty: {
                            message: 'Surname is required'
                        }
                    }
                }
            }
        });
    }

    this.setupAction = function(){
        $('#content-create-user button').click((e)=>{
            const bootstrapValidator = $('#content-create-user form').data('bootstrapValidator');
            if(bootstrapValidator.isValid()){
                __WEBPACK_IMPORTED_MODULE_1__backend__["a" /* default */].createUser(
                    //userdata
                    {
                        email: $('#content-create-user input[name=createuseremail]').val().trim(),
                        forename: $('#content-create-user input[name=createuserforename]').val().trim(),
                        surname: $('#content-create-user input[name=createusersurname]').val().trim(),
                    },
                    //success
                    (result)=>{
                        let str = '';
                        Object.keys(result).forEach((k)=>{
                            str += k + ': ' + result[k] + "\n";
                        })
                        $('#content-create-user .result').text(str);
                    },
                    //error
                    (result)=>{
                        $('#content-create-user .result').text(result);
                    },
                );
                e.preventDefault();
            }
        });
    }
}).apply(CreateUser);

/* harmony default export */ __webpack_exports__["a"] = (CreateUser);

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feedbackicons__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend__ = __webpack_require__(0);



const UpdateUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-update-user form').bootstrapValidator({
            feedbackIcons: __WEBPACK_IMPORTED_MODULE_0__feedbackicons__["a" /* default */],
            fields: {
                updateuseruserid: {
                    validators: {
                        notEmpty: {
                            message: 'User ID is required'
                        }
                    }
                }
            }
        });
    }

    this.setupAction = function(){
        $('#content-update-user button').click((e)=>{
            const bootstrapValidator = $('#content-update-user form').data('bootstrapValidator');
            if(bootstrapValidator.isValid()){
                __WEBPACK_IMPORTED_MODULE_1__backend__["a" /* default */].updateUser(
                    //userid
                    $('#update-user-userid').val().trim(),
                    //userdata
                    {
                        email: $('#content-update-user input[name=updateuseremail]').val().trim(),
                        forename: $('#content-update-user input[name=updateuserforename]').val().trim(),
                        surname: $('#content-update-user input[name=updateusersurname]').val().trim(),
                    },
                    //success
                    (result)=>{
                        $('#content-update-user .result').text(result ? result : 'Successfully updated user.');
                    },
                    //error
                    (result)=>{
                        $('#content-update-user .result').text(result);
                    },
                );
                e.preventDefault();
            }
        });
    }
}).apply(UpdateUser);

/* harmony default export */ __webpack_exports__["a"] = (UpdateUser);

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__feedbackicons__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__backend__ = __webpack_require__(0);



const DeleteUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-delete-user form').bootstrapValidator({
            feedbackIcons: __WEBPACK_IMPORTED_MODULE_0__feedbackicons__["a" /* default */],
            fields: {
                deleteuseruserid: {
                    validators: {
                        notEmpty: {
                            message: 'User ID is required'
                        }
                    }
                }
            }
        });
    }

    this.setupAction = function(){
        $('#content-delete-user button').click((e)=>{
            const bootstrapValidator = $('#content-delete-user form').data('bootstrapValidator');
            if(bootstrapValidator.isValid()){
                __WEBPACK_IMPORTED_MODULE_1__backend__["a" /* default */].deleteUser(
                    //userid
                    $('#delete-user-userid').val().trim(),
                    //success
                    (result)=>{
                        $('#content-delete-user .result').text(result ? result : 'Successfully deleted user.');
                    },
                    //error
                    (result)=>{
                        $('#content-delete-user .result').text(result);
                    },
                );
                e.preventDefault();
            }
            return false;
        });
    }
}).apply(DeleteUser);

/* harmony default export */ __webpack_exports__["a"] = (DeleteUser);


/***/ })
/******/ ]);