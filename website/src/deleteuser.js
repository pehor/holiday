import FEEDBACKICONS from './feedbackicons';
import backend from './backend';

const DeleteUser = {};

(function() {
    this.setupValidation = function(){
        $('#content-delete-user form').bootstrapValidator({
            feedbackIcons: FEEDBACKICONS,
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
                backend.deleteUser(
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

export default DeleteUser;
