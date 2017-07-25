import FEEDBACKICONS from './feedbackicons';
import backend from './backend';

const GetAllUsers = {};

(function() {
    this.setupAction = function(){
        $('#content-all-ids button').click((e)=>{
            backend.getAllUsers(
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

export default GetAllUsers;