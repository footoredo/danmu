#!/usr/bin/python
# -*- coding: utf-8 -*-

import web
import json

urls = (
	'/', 'index',
	'/get', 'get',
	'/send', 'send'
)

app = web.application(urls, globals())
render = web.template.render('.')
id_count = 5;

class index:
	def GET(self):
		return render.index()

class get:
  def GET(self):
    danmu = [
		  {"id":1,"time":1.0,"content":"HAHAHAHAHAHA"},
		  {"id":2,"time":1.7,"content":"呵呵呵呵呵呵呵呵"},
		  {"id":3,"time":8.6,"content":"傻逼"},
		  {"id":4,"time":10.3,"content":"Right!"}]
    return json.dumps(danmu)
		
class send(object):
  def POST(self):
    bullet = json.loads(web.data())
    global id_count;
    bullet["id"] = id_count;
    id_count = id_count + 1;
    return id_count;
		
if __name__ == "__main__":
    #web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
    app.run()
