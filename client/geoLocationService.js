require('./akermap').factory('geoLocation', ['$q', function($q) {

	return function() {
		var d = $q.defer();
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				d.resolve(position.coords);
			}, function() {
				d.reject();
			});
		} else {
			d.reject();
		}
		return d.promise;
	};
}]);
