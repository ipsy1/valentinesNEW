from http.server import HTTPServer, SimpleHTTPRequestHandler
import os

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super().end_headers()

if __name__ == '__main__':
    os.chdir('/app/web')
    server = HTTPServer(('0.0.0.0', 3001), CORSRequestHandler)
    print('🌐 Valentine\'s Week Web App running at http://localhost:3001')
    print('📱 Open this in any browser!')
    server.serve_forever()
