$(document).ready(function() {
    on_change_college();
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
    if ($("#register").length > 0) {
        $("#register").click(function() {
            window.location = '/register';
        });
    }
    if ($("#post_review_button").length > 0) {
        $("#post_review_button").click(submit_post);
    }
});

function submit_post() {
    var review_text = $("#review_text").val();
    var rating = $("#input_rating option:selected").text();
    var course_id = $("#courses").val();
    post_to_api('post_review', {
        'review_text': review_text,
        'course_id': course_id,
        'rating': rating},
        (err, res) => {
            if (res.success == true) {
                on_change_course();
            }
    });
}
