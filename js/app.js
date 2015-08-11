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
			type: 'food',
			fourSquareID: '49b064dcf964a520bc521fe3'
		},
		{
			coordinates: {lat: 34.041979, lng: -118.235406},
			name: 'Urth Caffe',
			street: '451 S Hewitt St',
			linkName: 'urthcaffe.com',
			phone: '(213) 797-4534',
			icon: 'images/red-dot.png',
			type: 'coffee',
			fourSquareID: '4a33da8ef964a520559b1fe3'
		},
		{
			coordinates: {lat: 34.045406, lng: -118.237441},
			name: 'EightyTwo',
			street: '707 E 4th Pl',
			linkName: 'eightytwo.la',
			phone: '(213) 626-8200',
			icon: 'images/blue-dot.png',
			type: 'drinks',
			fourSquareID: '5245b6610493d5f1808093cf'
		},
		{
			coordinates: {lat: 34.045161, lng: -118.238748},
			name: 'X Lanes',
			street: '333 Alameda St #300',
			linkName: 'xlanesla.com',
			phone: '(213) 229-8910',
			icon: 'images/blue-dot.png',
			type: 'drinks',
			fourSquareID: '516ecb46e4b0cc56cde5c6e3'
		},
		{
			coordinates: {lat: 34.046143, lng: -118.234074},
			name: 'Eat Drink Americano',
			street: '923 E 3rd St #101',
			linkName: 'eatdrinkamericano.com',
			phone: '(213) 620-0781',
			icon: 'images/red-dot.png',
			type: 'coffee',
			fourSquareID: '4fb9b117e4b05cad1ca73407'
		},
		{
			coordinates: {lat: 34.045414, lng: -118.236251},
			name: 'The Pie Hole',
			street: '714 Traction Ave',
			linkName: 'thepieholela.com',
			phone: '(213) 537-0115',
			icon: 'images/green-dot.png',
			type: 'food',
			fourSquareID: '4e992c725c5caa2f44ec6955'
		},
		{
			coordinates: {lat: 34.045279, lng: -118.238533},
			name: 'Shojin',
			street: '333 Alameda St #310',
			linkName: 'theshojin.com',
			phone: '(213) 617-0305',
			icon: 'images/green-dot.png',
			type: 'food',
			fourSquareID: '4a4c2e89f964a5201cad1fe3'
		}
	],

	// make an info window using i passed in from VM
	/*
	makeInfoWindow: function(i, infoWindow) {

		Model.requestFourSquare(i, infoWindow);


		return '<h1>' + Model.locations[i].name + '</h1>' +
			'<p>' + Model.locations[i].street + '</p>' +
			'<p>' + Model.cityString + '</p>' +
			'<br>' +
			'<p><a target="_blank" href="http://' + Model.locations[i].linkName + '">'
			+ Model.locations[i].linkName + '</a></p>'
			+ '</p>' + Model.locations[i].phone + '</p>';
	},
	*/

	fourSquareInfo: {
		clientID: 'AQCNP0VHT3VAKMLMIUH2OQHNP2XHXOWYFSYEJNJ0RSKR1JHA',
		clientSecret: 'VGTBLMPURRGIG4NSSIATQTTEUWKSWPWVKOHNDCECXCDVCEJB',
		version: 20130815
	},


	makeInfoWindow: function(i, infoWindow) {

		/*
			var oldbaseURL = 'https://api.foursquare.com/v2/venues/search?client_id=' +
			Model.fourSquareInfo.clientID + '&client_secret=' +
			Model.fourSquareInfo.clientSecret + '&v=' +
			Model.fourSquareInfo.version + '&ll=' +
			Model.mapOptions.center.lat + ',' +
			Model.mapOptions.center.lng + '&query=';
		*/

		var venueID = Model.locations[i].fourSquareID;

		var fullURL = 'https://api.foursquare.com/v2/venues/' +
			venueID + '?client_id=' +
			Model.fourSquareInfo.clientID + '&client_secret=' +
			Model.fourSquareInfo.clientSecret + '&v=' +
			Model.fourSquareInfo.version;

		$.ajax(fullURL, {
			dataType: 'jsonp',
			success: function(data) {
				var dataObj = data.response.venue;
				console.log(dataObj);

				infoWindow.setContent(
					'<h1>' + dataObj.name + '</h1>' +
					'<p>' + dataObj.location.address + '</p>' +
					'<p>' + dataObj.location.formattedAddress[1] + '</p>' +
					'<span><a target="_blank" href="' + dataObj.url + '">' + 'Website' + '</a></span>' +
					' | ' + '<span>' + dataObj.contact.formattedPhone + '</span>' +
					'<br>' + '<hr>' + '<br>' +
					'<span>' + '<strong class="rating green-text">' + dataObj.rating + '</strong>' + '/10 rating' + '</span>' +
					' | ' + '<span>' + '<strong>' + dataObj.likes.count + '</strong>' + ' likes' + '</span>' +
					'<p class="tips">' + dataObj.tips.groups[0].items[0].text + '</p>' +
					'<p class="tips">' + dataObj.tips.groups[0].items[1].text + '</p>' +
					'<p class="tips">' + dataObj.tips.groups[0].items[2].text + '</p>'
				);
			}
		});
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
		self.infoWindow = new google.maps.InfoWindow({
			maxWidth: 300
		});
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
			self.makeMarkersClickable(i, marker);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);

	// when a marker is clicked, open an info window and animate the marker
	self.makeMarkersClickable = function(i, markerCopy) {
		var content;
		// the click event handler for each marker
		google.maps.event.addListener(markerCopy, 'click', function() {
			var infoWindow = self.infoWindow;
			// get and the right content
			//content = Model.makeInfoWindow(i, infoWindow);
			Model.makeInfoWindow(i, infoWindow);
			// set the right content
			// self.infoWindow.setContent(content);
			// open the info window when clicked
			self.infoWindow.open(self.map, markerCopy);

			// make any previously clicked marker stop bouncing
			self.markersList.forEach(function(element) {
				element.setAnimation(null);
			});
			// make the clicked marker bounce
			markerCopy.setAnimation(google.maps.Animation.BOUNCE);
		});
		// make the marker stop bouncing when you close the info window
		google.maps.event.addListener(self.infoWindow, 'closeclick', function() {
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
		var i, result;

		google.maps.event.trigger(self.infoWindow, 'closeclick');

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


	// prevent form from submitting when user presses enter key
	$(document).on('keypress', 'form', function(e) {
		var code = e.keyCode || e.which;

		if (code === 13) {
			e.preventDefault();

			return false;
		}
	});
};

ko.applyBindings(new ViewModel());