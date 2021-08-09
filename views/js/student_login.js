$(document).ready(function(){
    $("#login").click(function(){
        var email = $("#email").val();
        var password = $("#password").val();
        // Checking for blank fields.
        if( email =='' || password ==''){
            alert("Please fill all fields...!!!!!!");
        }
        else if ( !isEmail(email) )
        {
            alert("Invalid email address!!!");
        }
        else {
            //Interact with server here
            $.ajax({
                url: '/student',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({email,password}),
                success: function(res)
                {
                    if ( res.success )
                    {
                        console.log('Signed up sucessfully');
                        window.location = "http://localhost:3000/student";
                    }
                    else
                    {
                        alert("Error in credentials!");
                    }
                }
            });
        }
    });
    $('#signup').click(function() {
        window.location = "http://localhost:3000/student_signup";
    });
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
});