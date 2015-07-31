/* --------------------- Model Data ---------------------- */

var data = {
	locations: [
		{
			lat: 34.040536,
			lng: -118.236646
		}
	]
};

var mapOptions = {
	center: new google.maps.LatLng(data.locations[0].lat, data.locations[0].lng),
	zoom: 15,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

/* --------------------- ViewModel ----------------------*/

var ViewModel = function() {
	var self = this;

	this.initialize = function() {
		var mapCanvas = document.getElementById('map-canvas');
		var map = new google.maps.Map(mapCanvas, mapOptions);
	};

	google.maps.event.addDomListener(window, 'load', this.initialize);
};

ko.applyBindings(new ViewModel());