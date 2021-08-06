$(document).ready(function(){
    var course = "";
    $('input:radio[name="radio"]').change(function(){
        course = $(this).val();
        console.log(course);
        $.ajax({
            url : '/select_course',
            type: 'POST',
            contentType: 'application/json',
            data : JSON.stringify({course: $(this).val()}),
            success : function(response)
            {
                if ( response.success )
                {
                    window.location = "http://localhost:3000/quiz_maker";
                }
                else
                {
                    alert("Something went wrong!");
                    window.location = "http://localhost:3000/select_course";
                }
            }
        });
    });
});