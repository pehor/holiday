import backend from './backend';
import GetAllUsers from './getallusers';
import GetUser from './getuser';
import CreateUser from './createuser';
import UpdateUser from './updateuser';
import DeleteUser from './deleteuser';


(function(){
    $( document ).ready(function() {

        GetAllUsers.setupAction();

        GetUser.setupValidation();
        GetUser.setupAction();

        CreateUser.setupValidation();
        CreateUser.setupAction();

        UpdateUser.setupValidation();
        UpdateUser.setupAction();

        DeleteUser.setupValidation();
        DeleteUser.setupAction();
    });
}());

