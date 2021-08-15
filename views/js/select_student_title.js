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
                    window.location = "http://localhost:3000/quiz_attempt";
                }
                else
                {
                    alert(response.error);
                    window.location = "http://localhost:3000/select_student_course";
                }
            }
        });
    });
});