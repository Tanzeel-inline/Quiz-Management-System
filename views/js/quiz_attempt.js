$(document).ready( function()
{
    var answer_sheet = $("#total_points").val();
    var answers = [];
    console.log(`Total answer in answer sheet are : ${answer_sheet}`);
    $('#submit').on("click",function() {
        console.log("Submit button has been clicked!");
        for ( var i = 0 ; i < answer_sheet ; i++ )
        {
            answers.push($('input[name=' + i + ']:checked').val());
        }
        for ( var i = 0 ; i < answers.length ; i++ )
        {
            if ( answers[i] )
            {
                console.log(answers[i]);
            }
        }
        $.ajax({
            url : '/quiz_attempt',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({answers}),
            success : function(response)
            {
                if ( !response.success )
                {
                    alert("Something went wrong!");
                }
                window.location = "http://localhost:3000/select_student_title";
            }
        });
    }); 
    
});