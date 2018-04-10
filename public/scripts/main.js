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

function post_to_api(method, params = {}, callback) {
    $.ajax('/' + method, {
        method: "POST",
        data: params,
        dataType: 'json'
    }).then(
        function success(res) {
            callback(null, res);
        },

        function fail(data, status) {
            callback(status, data);
        }
    );
}

$(document).ready(function() {
    if (document.getElementById("colleges")) on_change_college();
    if (document.getElementById("login_logout")) {
        console.log($("#login_logout").text());
        if ($("#login_logout").text() === '  Login ') {
            $("#login_logout").click(function () {
                window.location = '/login';
            });
        }
        else {
            $("#login_logout").click(function () {
                post_to_api('logout', {}, (req, res) => {
                    window.location = '/';
                });
            });
        }
    }
});

function on_change_course() {
    var course_select = document.getElementById('courses');
    var course_id = course_select.options[course_select.options.selectedIndex].value;
    $('#reviews_box').empty();
    get_from_api('get_reviews', {'course_id': course_id}, (err, res) => {
        for (var i =0; i < res.length; i++) {
            var new_review = package_review(res[i].username, res[i].rating, res[i].review_date, res[i].review_text);
            $('#reviews_box').append(new_review);
        }
    })
}

function package_review(username, rating, review_date, review_text) {
    var $new_review = $("<div class='container panel panel-default review'></div>");
    var $top_row = $("<div class='row'></div>");
    var $name = $("<div class='col-sm-8 name'></div>");
    $name.append("<h3>" + username + "</h3>");
    var $rating = $("<div class='col-sm-4 rating'></div>");
    $rating.append("<h3>" + rating + "/5</h3");
    $top_row.append($name).append($rating);
    $new_review.append($top_row).append("<p>" + review_text + "</p>");
    return $new_review;
}

function submit_login() {
    var username = $("#username").val();
    var password = $("#userpassword").val();
    post_to_api('login', {'username': username, 'password': password}, (err, res) => {
        if (typeof res.redirect == 'string') window.location = res.redirect;
    });
}

function submit_register() {
    var username = $("#username").val();
    var password = $("#userpassword").val();
    var email = $("#useremail").val();
    var first_name = $("#firstname").val();
    var last_name = $("#lastname").val();
    post_to_api('create_account', {
        'username': username,
        'password': password,
        'email': email,
        'firstname': first_name,
        'lastname': last_name},
        (err, res) => {
            if (typeof res.redirect == 'string') window.location = res.redirect;
    });
}