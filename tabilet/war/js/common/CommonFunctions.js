function toDateTimeString(src) {
	var year  = src.getFullYear();
	var month = src.getMonth() + 1;
	if (month < 10) month = "0" + month;
	var date = src.getDate();
	if (date < 10) date = "0" + date;
	var hour = src.getHours();
	if (hour < 10) hour = "0" + hour;
	var min = src.getMinutes();
	if (min < 10) min = "0" + min;

	var strDateTime = year + '-' + month + '-' + date + 'T' + hour + ':' + min;

	return strDateTime;
}

function toDateTimeString2(src) {
	var year  = src.getFullYear();
	var month = src.getMonth() + 1;
	if (month < 10) month = "0" + month;
	var date = src.getDate();
	if (date < 10) date = "0" + date;
	var hour = src.getHours();
	if (hour < 10) hour = "0" + hour;
	var min = src.getMinutes();
	if (min < 10) min = "0" + min;

	var strDateTime = year + '/<b>' + month + '/' + date + ' ' + hour + ':' + min + "</b>";

	return strDateTime;
}

function stringToLatLng(str){
	if(str == null) return null;
	str = str.substring(1,str.length - 1);
	var str_split = str.split(",");
	var lat = Number(str_split[0]);
	var lng = Number(str_split[1]);
	if(isNaN(lat) || isNaN(lng)) return null;
	var latlng = new google.maps.LatLng(lat, lng);
	return latlng;
}

function submitForm(action, method){
	var formElement = document.createElement('form');
	formElement.method = method;
	formElement.action = action;
	formElement.submit();
}
