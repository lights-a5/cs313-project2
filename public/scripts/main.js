function on_change_college() {
    var college_select = document.getElementById("colleges");
    var college_id = college_select.options[college_select.options.selectedIndex].value;
    $('#courses').empty();
    get_from_api('get_courses', {'college_id':college_id}, (err, res) => {
        var course_select = document.getElementById('courses');
        for (var i = 0; i < res.length; i++) {
            var new_option = document.createElement("option");
            new_option.text = res[i].course_name;
            new_option.value = res[i].id;
            course_select.add(new_option);
        }
        on_change_course();
    });
}

function get_from_api(method, params = {}, callback) {
    /*****************************************************
     * GET_FROM_API
     * args:        method: The method to call from the API
     *              params: The params to give to the API call
     *              callback: The function to call when done.
     * returns:     nothing
     * desc:        This function is a wrapper for all API calls to
     *              the host server. Give a valid method, the parameters
     *              for the method, and the callback to call if 
     ****************************************************/
    $.ajax('/' + method, {
        data: params,
    dataType: 'json'
    })
    .then(
        function success(res) {
            callback(null, res);
        },

        function fail(data, status) {
            callback(status, data);
        }
    );
}

$(document).ready(function() {
    on_change_college();
});

function on_change_course() {
    var course_select = document.getElementById('courses');
    var course_id = course_select.options[course_select.options.selectedIndex].value;
    $('#reviews_box').empty();
    get_from_api('get_reviews', {'course_id': course_id}, (err, res) => {
        for (var i =0; i < res.length; i++) {
            var reviews_box = document.getElementById('reviews_box');
            var new_review = document.createElement("div");
            new_review.textContent = res[i].review_text;
            $('#reviews_box').append(new_review);
        }
    })
}
