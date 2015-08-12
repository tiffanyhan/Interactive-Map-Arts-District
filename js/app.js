/* --------------------- Model Data ---------------------- */

var Model = {

	// options to set up our google map
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

	// our basic location array
	locations: [
		{
			name: 'Wurstkuche',
			type: 'food',
		},
		{
			name: 'Urth Caffe',
			type: 'coffee',
		},
		{
			name: 'EightyTwo',
			type: 'fun',
		},
		{
			name: 'X Lanes',
			type: 'fun',
		},
		{
			name: 'Eat Drink Americano',
			type: 'coffee',
		},
		{
			name: 'The Pie Hole',
			type: 'food',
		},
		{
			name: 'Guerrilla Tacos',
			type: 'food',
		},
		{
			name: 'Angel City Brewery',
			type: 'fun'
		}
	],

	// info to make our ajax request to four square
	fourSquareInfo: {
		clientID: 'AQCNP0VHT3VAKMLMIUH2OQHNP2XHXOWYFSYEJNJ0RSKR1JHA',
		clientSecret: 'VGTBLMPURRGIG4NSSIATQTTEUWKSWPWVKOHNDCECXCDVCEJB',
		version: 20130815
	},

	// populates location data with location coordinates and foursquare venue id
	getLocationCoordinatesAndID: function() {
		// prevent repetition in constructing base URL
		var fourSquare = Model.fourSquareInfo;
		var mapCenter = Model.mapOptions.center;
		// base URL searches for a query term near supplied coordinates
		var baseURL = 'https://api.foursquare.com/v2/venues/search?client_id=' +
			fourSquare.clientID + '&client_secret=' +
			fourSquare.clientSecret + '&v=' +
			fourSquare.version + '&ll=' +
			mapCenter.lat + ',' +
			mapCenter.lng + '&query=';

		// define variables outside the for loop
		var i, fullURL, dataObj, lat, lng, venueID;
		var locations = Model.locations;
		var locationsLength = locations.length;
		// make an ajax request for each location
		for (i = 0; i < locationsLength; i++) {
			// make the query term a location name
			fullURL = baseURL + locations[i].name;

			$.ajax(fullURL, {
				i: i,
				dataType: 'jsonp',
				success: function(data) {
					// get all the data needed from the data object
					dataObj = data.response.venues[0];
					lat = dataObj.location.lat;
					lng = dataObj.location.lng;
					venueID = dataObj.id;

					i = this.i
					// set properties of location with correct data
					Object.defineProperties(locations[i], {
						'coordinates' : {
							value: {
								lat: lat,
								lng: lng
							}
						},

						'fourSquareID': {
							value: venueID
						}
					});
				}
			});
		}
	},

	// programmatically set the icon color which goes
	// with the right location type
	setLocationIcon: function() {
		// define variables outside the for loop
		var i, color, location, locationType;
		var locationsLength = Model.locations.length;

		for (i = 0; i < locationsLength; i++) {
			location = Model.locations[i];
			locationType = location.type;

			// colors according to filterOptions array below
			if (locationType === 'food')
				color = 'green';
			else if (locationType === 'coffee')
				color = 'red';
			else if (locationType === 'fun')
				color = 'blue';

			// set icon property of location with image
			// of the marker that is the correct color
			Object.defineProperty(location, 'icon', {
				value: 'images/' + color + '-dot.png'
			});
		}
	},

	infoWindowContent: null,

	// sets the info window content
	makeInfoWindow: function(i, markerCopy) {
		// define variables to construct our full URL
		var venueID = Model.locations[i].fourSquareID;
		var fourSquare = Model.fourSquareInfo;
		// construct full URL to make ajax request to
		var fullURL = 'https://api.foursquare.com/v2/venues/' +
			venueID + '?client_id=' +
			fourSquare.clientID + '&client_secret=' +
			fourSquare.clientSecret + '&v=' +
			fourSquare.version;

		// make asychronous ajax request to get venue details
		$.ajax(fullURL, {
			dataType: 'jsonp',
			success: function(data) {
				// our basic data object for each location
				var dataObj = data.response.venue;
				// avoid repetition in accessing our data object
				var location = dataObj.location;
				var firstPhoto = dataObj.bestPhoto;
				var secondPhoto = dataObj.photos.groups[0].items[1];
				var tips = dataObj.tips.groups[0].items;

				// info window sections inclue basic information,
				// popularity/category, photos, tips, and attribution
				Object.defineProperty(Model, 'infoWindowContent', {
					value: '<h1>' + dataObj.name + '</h1>' +
					'<p>' + location.address + '</p>' +
					'<p>' + location.formattedAddress[1] + '</p>' +
					'<a target="_blank" href="' + dataObj.url + '">' + 'Website' + '</a>' +
					' | ' + '<span>' + dataObj.contact.formattedPhone + '</span>' +
					'<p class="hours">' + dataObj.hours.status + ' today' + '</p>' +

					'<hr>' +

					'<p>' +
						'<span>' + '<strong class="rating green-text">' + dataObj.rating + '</strong>' + '/10 rating' + '</span>' +
					' | ' + '<span>' + '<strong>' + dataObj.likes.count + '</strong>' + ' likes' + '</span>' +
					'</p>' +
					'<p class="line-height category">' + dataObj.categories[0].name + '</p>' +

					'<a href="' + firstPhoto.prefix + 'original' + firstPhoto.suffix + '">' +
						'<img class="best-photo" src="' + firstPhoto.prefix + '125x125' + firstPhoto.suffix + '">' +
					'</a>' +
					'<a href="' + secondPhoto.prefix + 'original' + secondPhoto.suffix + '">' +
						'<img class="second-photo" src="' + secondPhoto.prefix + '125x125' + secondPhoto.suffix + '">' +
					'</a>' +

					'<a class="plain-link" href="' + dataObj.canonicalUrl + '"' + 'ref="' + fourSquare.clientID +'"' + '>' +
						'<p class="line-height">' +
							'<strong>' + 'Tip 1:  ' + '</strong>' + tips[0].text +
						'</p>' +
						'<p class="line-height">' +
							'<strong>' + 'Tip 2:  ' + '</strong>' + tips[1].text +
						'</p>' +
						'<p class="line-height">' +
							'<strong>' + 'Tip 3:  ' + '</strong>' + tips[2].text +
						'</p>' +
					'</a>' + '<br>' +

					'<a href="http://foursquare.com">' + '<img src="images/foursquare.png">' + '</p>' + '</a>'
				});
				// once done constructing info window content,
				// call on VM to set info window to right marker
				myViewModel.setUpInfoWindow(markerCopy);
			}
		});
	},

	// categories to filter the locations
	filterOptions: [
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
			name: 'fun',
			image: 'images/blue-dot.png'
		}
	]
};


/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;

	Model.getLocationCoordinatesAndID();
	Model.setLocationIcon();

	// listen to the search box for changes
	self.query = ko.observable('');

	// put show options in VM to construct it in DOM using KO
	self.filterOptionsList = [];
	Model.filterOptions.forEach(function(element) {
		self.filterOptionsList.push(element);
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
		var locations = self.locationsList;
		var locationsLength = locations.length;
		var i, marker;
		// make one info window
		self.infoWindow = new google.maps.InfoWindow({
			maxWidth: 300
		});
		// for loop makes markers with info windows
		for (i = 0; i < locationsLength; i++) {
			// make markers
			marker = new google.maps.Marker({
				position: locations[i].coordinates,
				icon: locations[i].icon
			});
			marker.setMap(self.map);
			// add each marker to an array
			self.markersList.push(marker);
			// add info windows
			self.makeInfoWindow(i, marker);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);

	// when a marker is clicked, open an info window and animate the marker
	self.makeInfoWindow = function(i, markerCopy) {
		// the click event handler for each marker
		google.maps.event.addListener(markerCopy, 'click', function() {
			// model constructs info window content for each location
			Model.makeInfoWindow(i, markerCopy);
		});
	};

	self.setUpInfoWindow = function(markerCopy) {
		var infoWindow = self.infoWindow;
		// set the right content
		infoWindow.setContent(Model.infoWindowContent);
		// open the info window when a marker is clicked
		infoWindow.open(self.map, markerCopy);

		self.setUpMarkerAnimation(markerCopy);
	};

	self.setUpMarkerAnimation = function(markerCopy) {
		// make any previously clicked marker stop bouncing
		self.markersList.forEach(function(element) {
			element.setAnimation(null);
		});
		// make the clicked marker bounce
		markerCopy.setAnimation(google.maps.Animation.BOUNCE);
		// stop bouncing the marker when you close the info window
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

		// reset everything
		self.infoWindow.close();
		// first make all markers show on screen
		self.markersList.forEach(function(element) {
			element.setAnimation(null);
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
	self.setUpCategoryFilter = function(name) {
		var i, result;

		// reset everything
		self.infoWindow.close();
		// first show all markers and list items on screen
		self.markersList.forEach(function(element) {
			element.setAnimation(null);
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

// allows us to reference our instance of the ViewModel
var myViewModel = new ViewModel();

ko.applyBindings(myViewModel);