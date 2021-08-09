$(document).ready(function() {
    var title_set = false;
    var title_val = '';
    var questions = [];
    var options1 = [];
    var options2 = [];
    var options3 = [];
    var options4 = [];
    var answers = [];
    $('#submit').on('click', function() 
    {
        if ( !title_set )
        {
            setTitle();
            if ( !title_set )
            {
                alert("You haven't given the quiz a title");
                return;
            }
        }
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
        else
        {
            alert("One of the value is missing!");
            return;
        }
        
        $.ajax({
            url: '/quiz_maker',
            type: 'POST',
            contentType: 'application/json',
            data : JSON.stringify({questions,options1,options2,options3,options4,answers,title_val}),
            success: function(response)
            {
                if ( response.success )
                {
                    window.location = "http://localhost:3000/select_course";
                }
                else
                {
                    alert(response.error);
                    window.location = "http://localhost:3000/select_course";
                }
            }
        });
        
    });

    $('#next').on('click', function() {
        
        setTitle();
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

    function setTitle()
    {   
        //Checking if title was set
        if ( !title_set )
        {
            if ( $('#title').val() != '' )
            {
                title_val = $('#title').val();
                title_set = true;
                $("#title").prop('disabled', true);
            } 
        }
    }
});