$(function () {
    $('.register').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/register",
            type: 'POST',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({
                username: $('input[type="username"]').val(),
                password: $('input[type="password"]').val()
            }),
            success: function (user) {
                console.log(user);
            },
            error: function (err, status, xhr) {
                console.log(err);
            }
        });
    });
});