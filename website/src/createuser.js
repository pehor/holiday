import FEEDBACKICONS from './feedbackicons';
import backend from './backend';

const CreateUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-create-user form').bootstrapValidator({
            feedbackIcons: FEEDBACKICONS,
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
                backend.createUser(
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

export default CreateUser;