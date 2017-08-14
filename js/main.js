function errorHandler(element) {
    alert("An error occurred. Please try again later.");
}
$(document).ready(function () {
    $(window).on("load", function () {
        var landmarks = [
            {
                "name": 'Seoul Museum of Art',
                "lat": 37.565132,
                "long": 126.974833
        },
            {
                "name": 'Wongudan',
                "lat": 37.5598491,
                "long": 126.9775029
        },
            {
                "name": 'Deoksugung',
                "lat": 37.56365,
                "long": 126.974833
        },
            {
                "name": 'Namdaemun',
                "lat": 37.5599526,
                "long": 126.973108
        },
            {
                "name": 'Seoul City Hall',
                "lat": 37.567491,
                "long": 126.97713
        }
];

        var infoWindow = new google.maps.InfoWindow();
        var markers = [];
        var wikiURL = "https://en.wikipedia.org/w/api.php?action=opensearch&limit=1&callback=?&format=json&search=";

        /*store markers*/
        for (var x = 0; x < landmarks.length; x++) {

            var marker = new google.maps.Marker({
                position: {
                    lat: landmarks[x].lat,
                    lng: landmarks[x].long
                },
                map: map,
                animation: google.maps.Animation.DROP,
                name: landmarks[x].name,
                id: x
            });

            marker.addListener('click', handleclick);
            markers.push(marker);
        }

        //click on marker
        function handleclick() {
            this.setAnimation(google.maps.Animation.BOUNCE);
            fillInfoWindows(this, infoWindow);
        }

        //infowindow content
        function fillInfoWindows(marker, infowindow) {
            if (infowindow.marker !== undefined && infowindow.marker !== marker) {
                infowindow.marker.setAnimation(null);
            }

            /*Get JSON text from Wikipedia*/
            $.getJSON(wikiURL + marker.name)
                .done(function (result) {
                    infoWindow.marker = marker;
                    var window_data = result[2][0];
                    var innerHTML = '<div>' + window_data + ' <strong>Sourced from Wikipedia</strong></div>';
                    infowindow.setContent(innerHTML);
                })
                .fail(function (error) {
                    alert("API error!: " + error.responseText);
                });
            infowindow.open(map, marker);
            infowindow.addListener('closeclick', function () {
                infowindow.close();
                marker.setAnimation(null);
            });
        }

        //click on list item to open infowindow
        this.listClick = function () {
            //console.log(this.name);
            var linkClick = (this.name.trim());
            for (var i = 0; i < markers.length; i++) {
                if (markers[i].name === linkClick) {
                    markers[i].setAnimation(google.maps.Animation.BOUNCE);
                    fillInfoWindows(markers[i], infoWindow);
                }
            }
        };

        //knockoutJS viewmodel
        var viewModel = {
            places: ko.observableArray(landmarks),
            query: ko.observable(''),
            search: function (value) {

                viewModel.places.removeAll();
                //had to create copy of landmarks var because of hoisting
                var landmarks = [
                    {
                        "name": 'Seoul Museum of Art',
                        "lat": 37.565132,
                        "long": 126.974833
        },
                    {
                        "name": 'Wongudan',
                        "lat": 37.5598491,
                        "long": 126.9775029
        },
                    {
                        "name": 'Deoksugung',
                        "lat": 37.56365,
                        "long": 126.974833
        },
                    {
                        "name": 'Namdaemun',
                        "lat": 37.5599526,
                        "long": 126.973108
        },
                    {
                        "name": 'Seoul City Hall',
                        "lat": 37.567491,
                        "long": 126.97713
        }
];
                for (var j = 0; j < landmarks.length; j++) {
                    //console.log(value);
                    if (landmarks[j].name.toLowerCase().indexOf(value.toLowerCase()) >= 0) {
                        viewModel.places.push(landmarks[j]);
                    }
                }

                //clear markers
                for (i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                //show filtered markers
                for (i = 0; i < viewModel.places().length; i++) {
                    for (var k = 0; k < markers.length; k++) {

                        if (viewModel.places()[i].name === markers[k].name) {
                            markers[k].setMap(map);
                        }
                    }
                }


            }

        };

        viewModel.query.subscribe(viewModel.search);
        ko.applyBindings(viewModel);
    });
});
