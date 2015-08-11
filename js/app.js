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
			icon: 'images/green-dot.png',
			type: 'food',
			fourSquareID: '49b064dcf964a520bc521fe3'
		},
		{
			coordinates: {lat: 34.041979, lng: -118.235406},
			name: 'Urth Caffe',
			icon: 'images/red-dot.png',
			type: 'coffee',
			fourSquareID: '4a33da8ef964a520559b1fe3'
		},
		{
			coordinates: {lat: 34.045406, lng: -118.237441},
			name: 'EightyTwo',
			icon: 'images/blue-dot.png',
			type: 'fun',
			fourSquareID: '5245b6610493d5f1808093cf'
		},
		{
			coordinates: {lat: 34.045161, lng: -118.238748},
			name: 'X Lanes',
			icon: 'images/blue-dot.png',
			type: 'fun',
			fourSquareID: '516ecb46e4b0cc56cde5c6e3'
		},
		{
			coordinates: {lat: 34.046143, lng: -118.234074},
			name: 'Eat Drink Americano',
			icon: 'images/red-dot.png',
			type: 'coffee',
			fourSquareID: '4fb9b117e4b05cad1ca73407'
		},
		{
			coordinates: {lat: 34.045414, lng: -118.236251},
			name: 'The Pie Hole',
			icon: 'images/green-dot.png',
			type: 'food',
			fourSquareID: '4e992c725c5caa2f44ec6955'
		},
		{
			coordinates: {lat: 34.045279, lng: -118.238533},
			name: 'Shojin',
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

	infoWindowContent: '',

	fourSquareInfo: {
		clientID: 'AQCNP0VHT3VAKMLMIUH2OQHNP2XHXOWYFSYEJNJ0RSKR1JHA',
		clientSecret: 'VGTBLMPURRGIG4NSSIATQTTEUWKSWPWVKOHNDCECXCDVCEJB',
		version: 20130815
	},


	makeInfoWindow: function(i) {

		/*
			var oldbaseURL = 'https://api.foursquare.com/v2/venues/search?client_id=' +
			Model.fourSquareInfo.clientID + '&client_secret=' +
			Model.fourSquareInfo.clientSecret + '&v=' +
			Model.fourSquareInfo.version + '&ll=' +
			Model.mapOptions.center.lat + ',' +
			Model.mapOptions.center.lng + '&query=';
		*/

		var venueID = Model.locations[i].fourSquareID;
		var fourSquare = Model.fourSquareInfo;
		// construct URL to make ajax request to
		var fullURL = 'https://api.foursquare.com/v2/venues/' +
			venueID + '?client_id=' +
			fourSquare.clientID + '&client_secret=' +
			fourSquare.clientSecret + '&v=' +
			fourSquare.version;
		// make asychronous ajax request
		$.ajax(fullURL, {
			dataType: 'jsonp',
			success: function(data) {
				var dataObj = data.response.venue;
				console.log(dataObj);

				var location = dataObj.location;
				var firstPhoto = dataObj.bestPhoto;
				var secondPhoto = dataObj.photos.groups[0].items[1];
				var tips = dataObj.tips.groups[0].items;

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
			name: 'fun',
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
		var infoWindow;
		// the click event handler for each marker
		google.maps.event.addListener(markerCopy, 'click', function() {
			infoWindow = self.infoWindow;
			// get and the right content
			//content = Model.makeInfoWindow(i, infoWindow);
			Model.makeInfoWindow(i);
			// set the right content
			infoWindow.setContent(Model.infoWindowContent);
			// open the info window when clicked
			infoWindow.open(self.map, markerCopy);

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
		// close any open info windows when user clicks any category
		self.infoWindow.close();
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