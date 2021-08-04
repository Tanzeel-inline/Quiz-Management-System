$(document).ready(function(){
    var courses = [];
    $("#myButton").click(function(){
        $.ajax({
            url: '/course_pick',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(courses),
            success: function(response)
            {
                if ( response.success )
                {
                    console.log("Successfully assigned the coureses to the teacher");
                    window.location = "http://localhost:3000/quiz_maker";
                }
                else
                {
                    alert("Error ocurred! Please try again later!");
                }
            }
        });
    });
    $(document).on("change", "input[type='checkbox']", function () {
        if ( this.checked )
        {
            console.log("Value checked");
            courses.push($(this).val());
        }
        else
        {
            var index = courses.indexOf($(this).val());
            if (index !== -1) {
                courses.splice(index, 1);
            }
        }
    });
});


