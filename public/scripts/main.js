function update_courses() {
    var college_select = document.getElementById("colleges");
    var college_id = college_select.options[college_select.selected_index].value;
    var host = window.location.hostname;
    $.getJSON(host + '/get_courses?college_id=' + college_id, function(json_data) {
        alert(JSON.stringify(json_data));
    });

}