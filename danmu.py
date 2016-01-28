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

class index:
	def GET(self):
		return render.index()
		
class send:
  def POST(self):
    bullet = json.loads(web.data())
    print bullet["content"]
		
if __name__ == "__main__":
    web.wsgi.runwsgi = lambda func, addr=None: web.wsgi.runfcgi(func, addr)
    app.run()
