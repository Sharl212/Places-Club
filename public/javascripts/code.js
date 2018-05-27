let map;
let service;
let infowindow;
function initialize() { };

function initialize() {
    console.log('fired');
    if (navigator.geolocation) {

        navigator.geolocation.getCurrentPosition((Loc) => { // fetch the user's current location {lat, lng}
            let lat = Loc.coords.latitude;
            let lng = Loc.coords.longitude;
            console.log(lat, lng);

            let pyrmont = new google.maps.LatLng(lat, lng);

            map = new google.maps.Map(document.getElementById('map'), {
                center: pyrmont,
                zoom: 15
            });

            let request = {
                location: pyrmont,
                radius: '1500',
                type: ["resturants"]
            };

            service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, callback);
        });

    } else {
        console.log("THIS DEVICE DOES NOT SUPPORT GEOLOCATION");
    }
}




function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        for (let i = 0; i < results.length; i++) {
            let place = results[i];
            let state;
            console.log(place);

            document.getElementById('placesList').innerHTML +=
                `
                <li class='list-group-item'>
                    <form id='goingto'>
                        <img src='${place.icon}' width="15" height="15"/>
                        <span>${place.name}</span>
                        <span style="color:red" id='location' name='${place.vicinity}'>located at</span> ${place.vicinity}
                        rated <span id='rating' name='${place.rating}'>${place.rating}</span>
                        <input id='place' value='${place.name}'/>                        
                        <button class='btn btn-outline-primary' type='submit' value='${place.id}'>GOING</button>
                    </form>
                </li>
                `;
        }


        $('form').on('submit', function (e) {
            let place = e.target[0].value;
            let id = e.target[1].value;
            console.log(place, e.target[1].value);
            e.preventDefault();
            $.ajax({
                url: "/goingto",
                type: 'post',
                contentType: 'application/json',
                data: JSON.stringify({
                    place: place,
                    _id: id
                }),
                success: function (user) {
                    console.log(user);
                },
                error: function (err, status, xhr) {
                    console.log(err);
                }
            });
        });
    }
}