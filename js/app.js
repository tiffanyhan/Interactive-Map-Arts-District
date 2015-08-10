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
			phone: '(213) 687-4444',
			icon: 'images/green-dot.png',
			type: 'food'
		},
		{
			coordinates: {lat: 34.041979, lng: -118.235406},
			name: 'Urth Caffe',
			street: '451 S Hewitt St',
			linkName: 'urthcaffe.com',
			phone: '(213) 797-4534',
			icon: 'images/red-dot.png',
			type: 'coffee'
		},
		{
			coordinates: {lat: 34.045406, lng: -118.237441},
			name: 'EightyTwo',
			street: '707 E 4th Pl',
			linkName: 'eightytwo.la',
			phone: '(213) 626-8200',
			icon: 'images/blue-dot.png',
			type: 'drinks'
		},
		{
			coordinates: {lat: 34.045161, lng: -118.238748},
			name: 'X Lanes',
			street: '333 Alameda St #300',
			linkName: 'xlanesla.com',
			phone: '(213) 229-8910',
			icon: 'images/blue-dot.png',
			type: 'drinks'
		},
		{
			coordinates: {lat: 34.046143, lng: -118.234074},
			name: 'Eat Drink Americano',
			street: '923 E 3rd St #101',
			linkName: 'eatdrinkamericano.com',
			phone: '(213) 620-0781',
			icon: 'images/red-dot.png',
			type: 'coffee'
		},
		{
			coordinates: {lat: 34.045414, lng: -118.236251},
			name: 'The Pie Hole',
			street: '714 Traction Ave',
			linkName: 'thepieholela.com',
			phone: '(213) 537-0115',
			icon: 'images/green-dot.png',
			type: 'food'
		},
		{
			coordinates: {lat: 34.045279, lng: -118.238533},
			name: 'Shojin',
			street: '333 Alameda St #310',
			linkName: 'theshojin.com',
			phone: '(213) 617-0305',
			icon: 'images/green-dot.png',
			type: 'food'
		}
	],

	// make an info window using i passed in from VM
	makeInfoWindow: function(i) {

		return '<h1>' + Model.locations[i].name + '</h1>' +
			'<p>' + Model.locations[i].street + '</p>' +
			'<p>' + Model.cityString + '</p>' +
			'<br>' +
			'<p><a target="_blank" href="http://' + Model.locations[i].linkName + '">'
			+ Model.locations[i].linkName + '</a></p>'
			+ '</p>' + Model.locations[i].phone + '</p>';
	},

	// list of categories to organize the locations
	showOptions: [
		{
			name: 'all',
			image: null
		},
		{
			name: 'food',
			image: 'images/green-dot.png'
		},
		{
			name: 'coffee',
			image: 'images/red-dot.png'
		},
		{
			name: 'drinks',
			image: 'images/blue-dot.png'
		}
	]
};


/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;

	// listen to the search box for changes
	self.query = ko.observable('');

	// put show options in VM to construct it in DOM using KO
	self.showOptionsList = [];
	Model.showOptions.forEach(function(element) {
		self.showOptionsList.push(element);
	});

	// put locations in VM to construct listview in DOM using KO
	self.locationsList = [];
	Model.locations.forEach(function(element) {
		self.locationsList.push(element);
	});
	// put locations length in VM for use in search and show functions
	self.locationsListLength = self.locationsList.length;

	// make an array to hold each marker
	self.markersList = [];

	// initialize the map
	self.initialize = function() {
		// create the map
		var mapCanvas = document.getElementById('map-canvas');
		self.map = new google.maps.Map(mapCanvas, Model.mapOptions);

		// declare variables outside of the loop
		var locationsLength = Model.locations.length;
		var i, marker, location, addClickEvent;
		// make one info window
		var infoWindow = new google.maps.InfoWindow();
		// for loop makes markers with info windows
		for (i = 0; i < locationsLength; i++) {
			// make markers
			marker = new google.maps.Marker({
				position: Model.locations[i].coordinates,
				icon: Model.locations[i].icon
			});
			marker.setMap(self.map);
			// add each marker to an array
			self.markersList.push(marker);
			// add info windows
			self.makeMarkersClickable(i, marker, infoWindow);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);

	// when a marker is clicked, open an info window and animate the marker
	self.makeMarkersClickable = function(i, markerCopy, infoWindow) {
		var content;
		// the click event handler for each marker
		google.maps.event.addListener(markerCopy, 'click', function() {
			// get and the right content
			content = Model.makeInfoWindow(i);
			// set the right content
			infoWindow.setContent(content);
			// open the info window when clicked
			infoWindow.open(self.map, markerCopy);

			// make any previously clicked marker stop bouncing
			self.markersList.forEach(function(element) {
				lement.setAnimation(null);
			});
			// make the clicked marker bounce
			markerCopy.setAnimation(google.maps.Animation.BOUNCE);
		});
		// make the marker stop bouncing when you close the info window
		google.maps.event.addListener(infoWindow, 'closeclick', function() {
			markerCopy.setAnimation(null);
		});
	};

	// link each list item to the correct info window
	self.makeListClickable = function(index) {
		google.maps.event.trigger(self.markersList[index()], 'click');
	};

	self.search = function() {
		var searchValue = new RegExp(self.query(), 'i');
		var i, result;
		// first make all markers show on screen
		self.markersList.forEach(function(element) {
			element.setMap(self.map);
		});
		// and make all list items show on screen
		$('.list-item').show();

		for (i = 0; i < self.locationsListLength; i++) {
			// test if search query matches any location names
			result = searchValue.test(self.locationsList[i].name);
			// if the search query does not match a location name,
			// hide its marker and list item
			if (result === false) {
				self.markersList[i].setMap(null);

				$('#' + i).hide();
			}
		}
	};
	// if changes in the search box, call the search function
	self.query.subscribe(self.search);

	// name is the category clicked by the user
	self.show = function(name) {
		var i result;
		// first show all markers and list items on screen
		self.markersList.forEach(function(element) {
			element.setMap(self.map);
		});
		$('.list-item').show();

		// if the user clicked a category instead of all
		if (name !== 'all') {
			for (i = 0; i < self.locationsListLength; i++) {
				// save each location's type
				result = self.locationsList[i].type;
				// if the location's type does not equal the category
				// clicked, hide its marker and list item
				if (result !== name) {
					self.markersList[i].setMap(null);

					$('#' + i).hide();
				}
			}
		}
	};
};

ko.applyBindings(new ViewModel());