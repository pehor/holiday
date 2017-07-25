import FEEDBACKICONS from './feedbackicons';
import backend from './backend';

const UpdateUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-update-user form').bootstrapValidator({
            feedbackIcons: FEEDBACKICONS,
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
                backend.updateUser(
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

export default UpdateUser;