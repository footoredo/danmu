var danmu = new Array();
var displayed = new Array();
var api, danmu_check, last_check, gun, id_count=5;
var danmuplayerJQ, danmuplayer;

var get_top = function() {
  var top = 0;
  $(".bullet").each(function() {
    var b = $(this);
    if (b.position().left + b.width() >= danmuplayerJQ.width() && b.position().top + b.height() > top)
      top = b.position().top + b.height();
  });

  return top + "px";
}

var shoot_danmu = function(obj) {
  console.log(obj["content"]);
  var content = obj["content"];
	var bullet = document.createElement("div");
	bullet.setAttribute("class", "bullet");
	bullet.id = obj["id"];
	bullet.innerHTML = content;
	bullet.style.left = danmuplayerJQ.width() + "px";
	bullet.style.top = get_top();
	danmuplayer.appendChild(bullet);
	var JQ = $("#"+bullet.id);
	JQ.animate({"left":-JQ.width()}, 10000, "linear", function() {
	  JQ.remove();
  });
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

var init_player = function() {
  danmuplayer = document.createElement("div");
  danmuplayer.setAttribute("class", "danmuplayer");
  document.body.appendChild(danmuplayer);
  danmuplayerJQ = $(".danmuplayer");
}

var sync_player = function() {
  var flowplayer = $(".flowplayer");
  danmuplayer.style.width = flowplayer.width() + "px";
  danmuplayer.style.height = flowplayer.height() + "px";
  danmuplayer.style.top = flowplayer.position().top + "px";
  danmuplayer.style.left = flowplayer.position().left + "px";
}

window.onload = function() {
	api = flowplayer();

	danmu = [
		{"id":1,"time":1.0,"content":"HAHAHAHAHAHA"},
		{"id":2,"time":1.7,"content":"呵呵呵呵呵呵呵呵"},
		{"id":3,"time":8.6,"content":"傻逼"},
		{"id":4,"time":10.3,"content":"Right!"}
	]
	displayed = new Array();
	danmu_displayer = document.getElementById('danmu');
	gun = document.getElementById('gun');
	
	danmu_check = setInterval(update_danmu, 50);
	init_player();
	sync_player();
	
  api.on("pause", function() {
    $(".bullet").pause();
  });

  api.on("resume", function() {
    $(".bullet").resume();
  });

  api.on("seek", function() {
    last_check = api.video.time;
    $(".bullet").remove();
  });
};

var bullet = function(danmu_body) {
	danmu_body["id"] = id_count++;
	return danmu_body;
}

var fire_danmu = function() {
	var current = bullet({"time":api.video.time,"content":gun.value})
	gun.value = "";
	$.post("/send", JSON.stringify(current))
	shoot_danmu(current);
	setTimeout(function(){danmu.push(current);}, 500);
	return false;
}

