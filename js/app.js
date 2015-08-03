/* --------------------- Model Data ---------------------- */

var Model = {

	mapOptions: {
		center: {lat: 34.043450, lng: -118.236525},
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.TOP_RIGHT
		},
		panControlOptions: {
			position: google.maps.ControlPosition.LEFT_BOTTOM
		},
		zoomControlOptions: {
			position: google.maps.ControlPosition.RIGHT_CENTER
		}
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
		},
		{
			coordinates: {lat: 34.046143, lng: -118.234074},
			name: 'Eat Drink Americano',
			street: '923 E 3rd St #101',
			linkName: 'eatdrinkamericano.com',
			phone: '(213) 620-0781'
		},
		{
			coordinates: {lat: 34.045414, lng: -118.236251},
			name: 'The Pie Hole',
			street: '714 Traction Ave',
			linkName: 'thepieholela.com',
			phone: '(213) 537-0115'
		},
		{
			coordinates: {lat: 34.045279, lng: -118.238533},
			name: 'Shojin',
			street: '333 Alameda St #310',
			linkName: 'theshojin.com',
			phone: '(213) 617-0305'
		},
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
		var i, location, marker, addClickEvent;
		// only show one info window at a time
		var infoWindow = new google.maps.InfoWindow();

		// makes the markers and the info windows
		for (i = 0; i < locationsLength; i++) {
			location = Model.locations[i];
			// add markers
			marker = new google.maps.Marker({
				position: location.coordinates
			});
			marker.setMap(map);

			// add info windows by wrapping the event handler in an outside
			// function to create a closure
			addClickEvent = function(locationCopy, markerCopy, infoWindowCopy) {
				// the click event handler for each marker
				google.maps.event.addListener(marker, 'click', function() {
					// set the info window with the right content
					infoWindowCopy.setContent(
						 '<h1>' + locationCopy.name + '</h1>' +
					 	 '<p>' + locationCopy.street + '</p>' +
					 	 '<p>' + Model.cityString + '</p>' +
					 	 '<br>' +
					 	 '<p><a target="_blank" href="http://' + locationCopy.linkName + '">'
					 	 + locationCopy.linkName + '</a> | '
					 	 + locationCopy.phone + '</p>'
					);
					// open the info window when clicked
					infoWindowCopy.open(map, markerCopy);
				});
			// call the outside function immediately
			}(location, marker, infoWindow);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new ViewModel());