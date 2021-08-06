$(document).ready(function() {
    var questions = [];
    var options1 = [];
    var options2 = [];
    var options3 = [];
    var options4 = [];
    var answers = [];
    $('#submit').on('click', function() 
    {
        if ( $('#question').val() != '' && $('#option1').val() != '' && $('#option2').val() != '' &&
        $('#option3').val() != '' && $('#option4').val() != '' && $('#answer').val() != '')
        {
            questions.push($('#question').val());
            options1.push($('#option1').val());
            options2.push($('#option2').val());
            options3.push($('#option3').val());
            options4.push($('#option4').val());
            answers.push($('#answer').val());
        }
        
        $.ajax({
            url: '/quiz_maker',
            type: 'POST',
            contentType: 'application/json',
            data : JSON.stringify({questions,options1,options2,options3,options4,answers}),
            success: function(response)
            {
                if ( response.success )
                {
                    window.location = "http://localhost:3000/select_course";
                }
                else
                {
                    alert("Couldn't make the quiz");
                    window.location = "http://localhost:3000/select_course";
                }
            }
        });
        
    });

    $('#next').on('click', function() {
        console.log("I was clicked");
        if ( $('#question').val() != '' && $('#option1').val() != '' && $('#option2').val() != '' &&
        $('#option3').val() != '' && $('#option4').val() != '' && $('#answer').val() != '')
        {
            questions.push($('#question').val());
            options1.push($('#option1').val());
            options2.push($('#option2').val());
            options3.push($('#option3').val());
            options4.push($('#option4').val());
            answers.push($('#answer').val());
        }

        $('input[type=text').val('');
    });
});