$(document).ready(function(){
    var title = "";
    $('input:radio[name="radio"]').change(function(){
        title = $(this).val();
        console.log(title);
        $.ajax({
            url : '/select_student_title',
            type: 'POST',
            contentType: 'application/json',
            data : JSON.stringify({title: $(this).val()}),
            success : function(response)
            {
                if ( response.success )
                {
                    alert("Got success message!");
                    window.location = "http://localhost:3000/quiz_attempt";
                }
                else
                {
                    alert("Something went wrong!");
                    window.location = "http://localhost:3000/select_student_course";
                }
            }
        });
    });
});