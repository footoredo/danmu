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
	app.run()
