var danmu = new Array(), buffer = new Array();
var displayed = new Array();
var api, danmu_check, last_check, gun, id_count=5;
var danmuplayerJQ, danmuplayer;
var playerJQ, player;
var on_the_run = [];
var video_id;

var sleep = function(milliseconds) {
    var start = new Date().getTime();
    for (var i=0; i<1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) break;
    }
}

var get_pos = function(h) {
    on_the_run.forEach(function(a){if ($(a[1]).position().left+$(a[1]).width()<=danmuplayerJQ.width()) a[0]=-1})
    on_the_run = on_the_run.sort(function(a,b){if (a[0]<b[0]||a[0]==b[0]&&$(a[1]).position().top>$(b[1]).position().top) return 1; else return -1});
    while (on_the_run.length && on_the_run[on_the_run.length-1][0]==-1) on_the_run.pop();
    var z=0, y=0;
    if (on_the_run[0]) z = on_the_run[0][0];
    for (var i=0; i<on_the_run.length && on_the_run[i][0]==z; i++)
        if (y+h > $(on_the_run[i][1]).position().top) {
            y = $(on_the_run[i][1]).position().top + $(on_the_run[i][1]).height();
        }
        else break;
    if (y+h > playerJQ.height()) {
        z++;
        y=0;
    }
    console.log(z,y);
    return [z,y];
}

var shoot_danmu = function(obj) {
    //console.log(danmu.findIndex(function(x){return x==obj}));
    var content = obj["context"];
    var bullet = document.createElement("div");
    bullet.setAttribute("class", "bullet");
    bullet.id = obj["id"];
    bullet.innerHTML = content;
    bullet.style.left = danmuplayerJQ.width() + "px";
    bullet.style.visibility = "hidden";
    danmuplayer.appendChild(bullet);
    var pos = get_pos($(bullet).height());
    bullet.style.top = pos[1] + "px";
    bullet.style.visibility = "visible";
    var JQ = $(bullet);
    on_the_run.push([pos[0],bullet]);
    JQ.animate({"left":-JQ.width()}, 10000, "linear", function() {
            JQ.remove();
            });
    if (api.paused) JQ.pause();
}

var buffer_timeout = function(i) {
    return setTimeout(function(){
       if (api.paused) return;
       shoot_danmu(danmu[i]);
       if (i+100 < danmu.length)
            buffer.push(buffer_timeout(i+100));
        buffer.shift();
    }, 1000*(danmu[i]["send_time"]-api.video.time));
}

var buffer_danmu = function() {
    var time = api.video.time, start;
    for (var i=0; i<danmu.length; i++) {
        if (danmu[i]["send_time"]-0.000001 > time) {
            start = i; break;
        }
    }

    console.log("buffer_time:"+time);
    console.log("start:"+start);
    for (var i=start; i<danmu.length && i-start<100; i++) {
        if (buffer.find(function(x){x==danmu[i]})) continue;
        var timeout = buffer_timeout(i);
        buffer.push(timeout);
    }
}

var clear_buffer = function() {
    while (buffer.length) {
        clearTimeout(buffer[0]);
        buffer.shift();
    }
}

var init_player = function() {
    danmuplayer = document.createElement("div");
    danmuplayer.setAttribute("class", "danmuplayer");
    danmuplayer.style.width = danmuplayer.style.height = "100%";
    playerJQ = $(".fp-player");
    player = document.getElementsByClassName("fp-player")[0];
    player.appendChild(danmuplayer)
    danmuplayerJQ = $(".danmuplayer");
}

var sync_player = function() {
    danmuplayer.style.width = playerJQ.width() + "px";
    danmuplayer.style.height = playerJQ.height() + "px";
    danmuplayer.style.top = playerJQ.position().top + "px";
    danmuplayer.style.left = playerJQ.position().left + "px";
}

window.onload = function() {
    api = flowplayer();
    video_id = document.getElementsByClassName("flowplayer")[0].id;
    init_player();
    //sync_player();
    //$(window).resize(function(){sync_player()});

    $.get("http://danmu.footoredo.cat/get/video/" + video_id, function(data, status) {
            danmu = JSON.parse(data);
            danmu = danmu.sort(function(a,b){return a["send_time"]-b["send_time"]});
            if (api.playing) buffer_danmu();
            })

    gun = document.getElementById('gun');

    api.on("pause", function() {
                clear_buffer();
                $(".bullet").pause();
            });

    api.on("resume", function() {
            $(".bullet").resume();
            buffer_danmu();
            });

    api.on("seek", function() {
            if (api.playing) {
                clear_buffer();
                $(".bullet").remove();
                buffer_danmu();
            }
            else {
                $(".bullet").remove();
            }
            });

    /*api.on("fullscreen", function() {
            $(window).unbind("resize");
            danmuplayer.style.width = "100%";
            danmuplayer.style.height = "100%";
            danmuplayer.style.top = "0";
            danmuplayer.style.left = "0";
            });

    api.on("fullscreen-exit", function() {
            sync_player();
            $(window).resize(function(){sync_player()});
            });*/
};


var fire_danmu = function() {
    var bullet = {"send_time":api.video.time,"context":gun.value};
    bullet["video_id"] = video_id;
    bullet["user_id"] = "";

        if (gun.value.length > 50) {
            alert("太长了傻逼");
            return false;
        }
    gun.value = "";
    console.log(bullet);
    $.post("/send", bullet, function(data, status) {
            console.log(data);
            console.log(status);
            bullet["id"] = data;
            shoot_danmu(bullet);
            setTimeout(function(){danmu.push(bullet);}, 500);
            });
    return false;
}

