/* --------------------- Model Data ---------------------- */

	var locations = {
		losAngeles: {lat: 34.043450, lng: -118.236525},
		Wurstkuche: {lat: 34.045600, lng: -118.236063},
		Urth: {lat: 34.041979, lng: -118.235406},
		eightyTwo: {lat: 34.045406, lng: -118.237441},
		xLanes: {lat: 34.045161, lng: -118.238748},
	};

	var mapOptions = {
		center: locations.losAngeles,
		zoom: 16,
		mapTypeId: google.maps.MapTypeId.TERRAIN
	};

	var infoWindows = {
		Wurstkuche: new google.maps.InfoWindow({
			content: '<h1>Wurstkuche</h1>' +
					 '<p>800 E 3rd St</p>' +
					 '<p>Los Angeles, CA 90013</p>'
		}),
		Urth: new google.maps.InfoWindow({
			content: '<h1>Urth Caffe</h1>' +
					 '<p>451 S Hewitt St</p>' +
					 '<p>Los Angeles, CA 90013</p>'
		}),
		eightyTwo: new google.maps.InfoWindow({
			content: '<h1>EightyTwo</h1>' +
					 '<p>707 E 4th Pl</p>' +
					 '<p>Los Angeles, CA 90013</p>'
		}),
		xLanes: new google.maps.InfoWindow({
			content: '<h1>X Lanes </h1>' +
					 '<p>333 Alameda St #300</p>' +
					 '<p>Los Angeles, CA 90013</p>'
		})
	};

	var markerData = [
		{
			position: locations.Wurstkuche,
			label: 'A',
			infoWindow: infoWindows.Wurstkuche
		},
		{
			position: locations.Urth,
			label: 'B',
			infoWindow: infoWindows.Urth
		},
		{
			position: locations.eightyTwo,
			label: 'C',
			infoWindow: infoWindows.eightyTwo
		},
		{
			position: locations.xLanes,
			label: 'D',
			infoWindow: infoWindows.xLanes
		}
	];

/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;
	// initialize the map
	this.initialize = function() {
		// create the map
		var mapCanvas = document.getElementById('map-canvas');
		var map = new google.maps.Map(mapCanvas, mapOptions);

		// declare variables outside of the loop
		var markerDataLength = markerData.length;
		var i, marker, addClickEvent;
		// add markers with info windows
		for (i = 0; i < markerDataLength; i++) {
			// add markers
			marker = new google.maps.Marker(markerData[i]);
			marker.setMap(map);
			// add info windows by wrapping the event handler in an outside
			// function to create a closure
			addClickEvent = function(iCopy, markerCopy) {
				google.maps.event.addListener(marker, 'click', function() {
					markerData[iCopy].infoWindow.open(map, markerCopy);
				});
			}(i, marker);
		}
	};
	// wait until the page has loaded to create the map
	google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new ViewModel());