var danmu = new Array();
var displayed = new Array();
var api, danmu_check, last_check, gun, id_count=5;
var danmuplayerJQ, danmuplayer;
var playerJQ, player;

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
	var JQ = $(".bullet#"+bullet.id);
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
  playerJQ = $(".flowplayer");
  player = document.getElementsByClassName("flowplayer")[0];
}

var sync_player = function() {
  danmuplayer.style.width = playerJQ.width() + "px";
  danmuplayer.style.height = playerJQ.height() + "px";
  danmuplayer.style.top = playerJQ.offset().top + "px";
  danmuplayer.style.left = playerJQ.offset().left + "px";
}

window.onload = function() {
	api = flowplayer();

	$.get("/get", function(data, status) {
	  danmu = JSON.parse(data);
	})
	displayed = new Array();
	danmu_displayer = document.getElementById('danmu');
	gun = document.getElementById('gun');
	
	danmu_check = setInterval(update_danmu, 50);
	init_player();
	sync_player();
	$(window).resize(function(){sync_player()});
	
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
  
  api.on("fullscreen", function() {
    $(window).unbind("resize");
    danmuplayer.style.width = "100%";
    danmuplayer.style.height = "100%";
    danmuplayer.style.top = "0";
    danmuplayer.style.left = "0";
  });
  
  api.on("fullscreen-exit", function() {
    sync_player();
    $(window).resize(function(){sync_player()});
  });
};


var fire_danmu = function() {
	var bullet = {"time":api.video.time,"content":gun.value};
	if (gun.value.length > 50) {
	  alert("太长了傻逼");
	  return false;
  }
	gun.value = "";
	$.post("/send", JSON.stringify(bullet), function(data, status) {
	  console.log(data);
	  bullet["id"] = data;
	  shoot_danmu(bullet);
	  setTimeout(function(){danmu.push(bullet);}, 500);
	});
	return false;
}

