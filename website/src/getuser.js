import FEEDBACKICONS from './feedbackicons';
import backend from './backend';

const GetUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-get-user form').bootstrapValidator({
            feedbackIcons: FEEDBACKICONS,
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
                backend.getUser(
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

export default GetUser;