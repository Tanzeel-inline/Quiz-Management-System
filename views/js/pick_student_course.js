$(document).ready(function(){
    var courses = [];
    $("#myButton").click(function(){
        $.ajax({
            url: '/pick_student_course',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(courses),
            success: function(response)
            {
                if ( response.success )
                {
                    console.log("Successfully assigned the coureses to the student");
                    window.location = "http://localhost:3000/select_student_course";
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


