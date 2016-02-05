#!/usr/bin/python
# -*- coding: utf-8 -*-

import web
import json
import database
import settings
import os
import re

urls = (
	'/', 'index',
	'/get/video/(\w{40})', 'get_video',
	'/send', 'send'
)

app = web.application(urls, globals())
render = web.template.render('.')
db = database.DB()
video_url = 'http://fvck.it/darling-talk'

def get_url(video_url):
    ret = re.findall(r'http\S+',os.popen("you-get -u %s" % repr(video_url)).read())[0]
    return ret

class index:
	def GET(self):
		return render.index(video_url)

class get_video:
    def std_time(self, danmu):
        danmu["create_time"] = danmu["create_time"].isoformat()
        danmu["update_time"] = danmu["update_time"].isoformat()
        
    def GET(self, sha):
        web.header("Access-Control-Allow-Origin", settings.ALLOW_ORIGIN)
        danmu = db.get_danmu("where video_id='%s'" % sha)
        map(self.std_time, danmu)
        return json.dumps(danmu)
		
class send:
    def POST(self):
        web.header("Access-Control-Allow-Origin", settings.ALLOW_ORIGIN)
        danmu = web.input(_method="post")
        danmu["context"] = danmu["context"].encode('utf-8')
        return db.send_danmu(**danmu);
		
if __name__ == "__main__":
        web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
        app.run()
