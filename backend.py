import tornado.ioloop
import tornado.web
import os

root = ""

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        try:
            with open(os.path.join(root, 'index.html')) as f:
                self.write(f.read())
        except IOError as e:
            self.write("404: Not Found")

favicon_path = ""
static_path = "public"
scripts_path = "scripts"
js_path = "js"
lib_path = "lib"

handlers = [
            (r'/favicon.ico', tornado.web.StaticFileHandler, {'path': favicon_path}),
            (r'/public/(.*)', tornado.web.StaticFileHandler, {'path': static_path}),
            (r'/scripts/(.*)', tornado.web.StaticFileHandler, {'path' : scripts_path}),
            (r'/js/(.*)', tornado.web.StaticFileHandler, {'path' : js_path}),
            (r'/lib/(.*)', tornado.web.StaticFileHandler, {'path' : lib_path}),
            (r'/', MainHandler)
]

application = tornado.web.Application(handlers)

if __name__ == "__main__":
    application.listen(8888)
    tornado.ioloop.IOLoop.instance().start()