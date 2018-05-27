$(function () {
    $('.login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            url: "/login",
            type: 'post',
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
})