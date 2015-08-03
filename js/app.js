/* --------------------- Model Data ---------------------- */

var Model = {

	mapOptions: {
		center: {lat: 34.043450, lng: -118.236525},
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	},

	cityString: 'Los Angeles, CA 90013',

	locations: [
		{
			coordinates: {lat: 34.045600, lng: -118.236063},
			name: 'Wurstkuche',
			street: '800 E 3rd St',
			linkName: 'wurstkuche.com',
			phone: '(213) 687-4444'
		},
		{
			coordinates: {lat: 34.041979, lng: -118.235406},
			name: 'Urth Caffe',
			street: '451 S Hewitt St',
			linkName: 'urthcaffe.com',
			phone: '(213) 797-4534'
		},
		{
			coordinates: {lat: 34.045406, lng: -118.237441},
			name: 'EightyTwo',
			street: '707 E 4th Pl',
			linkName: 'eightytwo.la',
			phone: '(213) 626-8200'
		},
		{
			coordinates: {lat: 34.045161, lng: -118.238748},
			name: 'X Lanes',
			street: '333 Alameda St #300',
			linkName: 'xlanesla.com',
			phone: '(213) 229-8910'
		}
	]
};

/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;
	// initialize the map
	this.initialize = function() {
		// create the map
		var mapCanvas = document.getElementById('map-canvas');
		var map = new google.maps.Map(mapCanvas, Model.mapOptions);

		// declare variables outside of the loop
		var locationsLength = Model.locations.length;
		var i, location, marker, infoWindow, addClickEvent;

		for (i = 0; i < locationsLength; i++) {
			location = Model.locations[i];
			// add markers
			marker = new google.maps.Marker({
				position: location.coordinates
			});
			marker.setMap(map);

			// make an info window
			infoWindow = new google.maps.InfoWindow({
				content: '<h1>' + location.name + '</h1>' +
					 	 '<p>' + location.street + '</p>' +
					 	 '<p>' + Model.cityString + '</p>' +
					 	 '<br>' +
					 	 '<p><a href="http://' + location.linkName + '">'
					 	 + location.linkName + '</a> | '
					 	 + location.phone + '</p>'
			});

			// add info windows by wrapping the event handler in an outside
			// function to create a closure
			addClickEvent = function(iCopy, markerCopy, infoWindowCopy) {
				google.maps.event.addListener(marker, 'click', function() {
					infoWindowCopy.open(map, markerCopy);
				});
			}(i, marker, infoWindow);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new ViewModel());