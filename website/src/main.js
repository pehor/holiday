(function(){
    $( document ).ready(function() {
        $('.all-ids').click((e)=>{
            //$('.result').text('lala');
            $.ajax({
                contentType: 'application/json',
                type: 'GET',
                url: 'https://bepywqavse.execute-api.eu-west-2.amazonaws.com/prod/users',
                dataType: 'json',
                success: (data)=>{
                    $('#result').text(JSON.stringify(data, null, '    '));
                }
            });
        });
    });
}());

