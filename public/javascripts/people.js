console.log('yea im here, dont worry')

function FetchPeople() {
    $.ajax({
        url: "/peoplegoing",
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function (results) {
            for (let i = 0; i < results.length; i++) {
                console.log(results)
                let place = results[i].place;
                let username = results[i]._creator.username;

                document.getElementById('PeopleList').innerHTML += `<li class='list-group-item'><span class='username'>${username}</span> is going to <span class='place'>${place}</span></li>`
            }
        },
        error: function (err, status, xhr) {
            console.log(err);
        }
    });
};

FetchPeople();