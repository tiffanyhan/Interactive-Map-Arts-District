/* --------------------- Model Data ---------------------- */

var Model = {

	mapOptions: {
		center: {lat: 34.044174, lng: -118.236128},
		zoom: 15,
		mapTypeId: google.maps.MapTypeId.TERRAIN,
		mapTypeControlOptions: {
			position: google.maps.ControlPosition.TOP_CENTER
		},
		panControlOptions: {
			position: google.maps.ControlPosition.LEFT_TOP
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
		}
	],

	makeInfoWindow: function(i) {

		return '<h1>' + Model.locations[i].name + '</h1>' +
			'<p>' + Model.locations[i].street + '</p>' +
			'<p>' + Model.cityString + '</p>' +
			'<br>' +
			'<p><a target="_blank" href="http://' + Model.locations[i].linkName + '">'
			+ Model.locations[i].linkName + '</a> | '
			+ Model.locations[i].phone + '</p>';
	}
};


/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;

	self.myMessage = ko.observable('Hello, World!');
	self.locationsList = ko.observableArray();

	Model.locations.forEach(function(element) {
		self.locationsList.push(element);
	});

	this.makeListClickable = function(index) {
		console.log(index());
	};


	// initialize the map
	this.initialize = function() {
		// create the map
		var mapCanvas = document.getElementById('map-canvas');
		var map = new google.maps.Map(mapCanvas, Model.mapOptions);

		// declare variables outside of the loop
		var locationsLength = Model.locations.length;
		var i, marker, location, addClickEvent;
		// only show one info window at a time
		var infoWindow = new google.maps.InfoWindow();

		// makes the markers and the info windows
		for (i = 0; i < locationsLength; i++) {
			// add markers
			marker = new google.maps.Marker({
				position: Model.locations[i].coordinates
			});
			marker.setMap(map);

			// add info windows by wrapping the event handler in an outside
			// function to create a closure
			addClickEvent = function(i, markerCopy, infoWindowCopy) {
				// the click event handler for each marker
				google.maps.event.addListener(marker, 'click', function() {
					// set the info window with the right content
					var content = Model.makeInfoWindow(i);

					infoWindowCopy.setContent(content);
					// open the info window when clicked
					infoWindowCopy.open(map, markerCopy);
				});
			// call the outside function immediately
			}(i, marker, infoWindow);

			// self.makeListClickable(i, marker, infoWindow);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new ViewModel());