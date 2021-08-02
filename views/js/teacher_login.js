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
            //Interact with server here
            $.ajax({
                url: '/teacher_signup',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({email,password}),
                success: function(res)
                {
                    if ( res.success )
                    {
                        console.log('Signed up sucessfully');
                        window.location = "http://localhost:3000/teacher";
                    }
                }
            });
        }
    });
    $('#signup').click(function() {
        window.location = "http://localhost:3000/teacher_signup";
    });
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        console.log("I was called");
        return regex.test(email);
    }
});