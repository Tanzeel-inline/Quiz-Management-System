$(document).ready(function()
{
    $('#Teacher').click(function(){
        var profiles = {'user' : 'teacher'};
        console.log("Teacher summoned");
        $.ajax({
            url: '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profiles),
            success: function(res){
                if ( res == 'success')
                {
                    window.location = "http://localhost:3000/teacher";
                }
                else
                {
                    alert("Invalid option!");
                }
            }
        });
    });
    $('#Student').click(function(){
        var profiles = {'user' : 'student'};
        console.log("Student summoned");
        $.ajax({
            url: '/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(profiles),
            success: function(res){
                if ( res == 'success')
                {
                    window.location = "http://localhost:3000/student";
                }
                else
                {
                    alert("Invalid option!");
                }
            }
        });
    });
});