var danmu = new Array();
var displayed = new Array();
var api, danmu_displayer, danmu_check, last_check, gun, id_count=5;

var shoot_danmu = function(obj) {
	danmu_displayer.value = obj["content"]
	setTimeout(function() { danmu_displayer.value = ""; }, 1000);
}

var search_danmu = function(time) {
	var ret = new Array();
	for (var x in danmu) {
	  var obj = danmu[x];
		if (obj["time"] >= last_check && obj["time"] < time) {
		  displayed[obj["id"]] = true;
			ret.push(obj);
		}
	}
	last_check = time;
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
		{"id":2,"time":1.7,"content":"呵呵"},
		{"id":3,"time":8.6,"content":"傻逼"},
		{"id":4,"time":10.3,"content":"Right!"}
	]
	displayed = new Array();
	danmu_displayer = document.getElementById('danmu');
	gun = document.getElementById('gun');
	
	danmu_check = setInterval(update_danmu, 50);
};

var bullet = function(danmu_body) {
	danmu_body["id"] = id_count++;
	return danmu_body;
}

var fire_danmu = function() {
	var current = bullet({"time":api.video.time,"content":gun.value})
	gun.value = "";
	$.post("/send", JSON.stringify(current))
	danmu.push(current);
	shoot_danmu(current)
	return false;
}

