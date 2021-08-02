$(document).ready(function(){
    $("#login").click(function(){
        var email = $("#email").val();
        var password = $("#password").val();
        // Checking for blank fields.
        if( email =='' || password ==''){
            $('input[type="text"],input[type="password"]').css("border","2px solid red");
            $('input[type="text"],input[type="password"]').css("box-shadow","0 0 3px red");
            alert("Please fill all fields...!!!!!!");
        }
        else if ( !isEmail(email) )
        {
            alert("Invalid email address!!!");
        }
        else {
            $.ajax({
                url: '/student',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({email,password}),
                success : (response)=>{
                    if ( response.success )
                    {
                        console.log(response);
                        console.log("Successfully received the data");
                    }
                    else
                    {
                        alert("Invalid creditnials");
                    }
                },
            });
        }
    });
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
});