var danmu = new Array();
var displayed = new Array();
var api, danmu_input;

var shoot_danmu = function(obj) {
  danmu_input.value = obj["content"]
  setTimeout(function() { danmu_input.value = ""; }, 1000);
}

var search_danmu = function(time) {
	var ret = new Array();
	for (var x in danmu) {
	  var obj = danmu[x];
		if (obj["time"] < time && !displayed[obj["id"]]) {
		  displayed[obj["id"]] = true;
			ret.push(obj);
		}
	}
	return ret;
}

var update_danmu = function() {
  time = api.video.time
	var to_display = search_danmu(time)
	for (var x in to_display) {
	  var obj = to_display[x];
		shoot_danmu(obj);
	}
}

window.onload = function() {
  api = flowplayer();

	danmu = [
		{"id":1,"time":1.0,"content":"HAHA"},
		{"id":2,"time":3.3,"content":"HEHE"},
		{"id":3,"time":8.6,"content":"Stupid ass"},
		{"id":4,"time":10.3,"content":"Right!"}
	]
	displayed = new Array();
	danmu_input = document.getElementById('danmu')
	
	setInterval(update_danmu, 50);
};

