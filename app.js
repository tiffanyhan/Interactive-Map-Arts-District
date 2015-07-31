/* --------------------- Model Data ---------------------- */

var mapOptions = {
	center: new google.maps.LatLng(34.040536, -118.236646),
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