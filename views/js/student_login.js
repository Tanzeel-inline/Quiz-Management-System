$(document).ready(function(){
    $("#login").click(function(e){
		e.preventDefault();
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
            $.ajax({
                url: '/student',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({email,password}),
                success: function(res)
                {
                    if ( res.success )
                    {
                        window.location = "http://localhost:3000/select_student_course";
                    }
                    else
                    {
                        alert("Wrong Email or password!");
                    }
                },
                error: function()
                {   
                    alert('Problem is here');
                }
            });
        }
    });
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }
});