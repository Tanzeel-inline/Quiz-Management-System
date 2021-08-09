$(document).ready(function(){
    $("#signup").click(function(){
        var email = $("#email").val();
        var username = $("#username").val();
        var password = $("#password").val();
        var contact = $('#contact').val();
        var address = $('#address').val();
        // Checking for blank fields.
        if( email =='' || password =='' ||
         username =='' || contact =='' || address =='' )
        {
            alert("Please fill all fields...!!!!!!");
        }
        else if ( !isEmail(email) )
        {
            alert("Invalid email address!!!");
        }
        else if ( !contactLength(contact) )
        {
            alert("Contact number must have 11 characters only! Example : 03001234567");
        }
        else if ( !addressLength(address)) {
            alert("Length exceeded, maximum allowed length is 100");
        }
        else
        {
            //Interact with server here
            $.ajax({
                url: '/student_signup',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({email,username,password,contact,address}),
                success: function(response)
                {
                    console.log("Inside the receiving function");
                    console.log(response.success);
                    if ( response.success )
                    {
                        console.log('Signed up sucessfully');
                        window.location = "http://localhost:3000/student";
                    }
                    else
                    {
                        //Check here what error server gave, send back another variable in object form
                        alert("Error in credentials!");
                    }
                }
            });
        }
    });
    $('#login').click(function(){
        window.location = "http://localhost:3000/student";
    });
    function isEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        console.log("I was called");
        return regex.test(email);
    }
    function contactLength(contact)
    {
        if ( contact.length != 11)
        {
            return false;
        }
        return true;
    }
    function addressLength(address)
    {
        if ( address.length > 100 )
        {
            return false;
        }
        return true;
    }
});