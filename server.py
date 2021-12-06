from flask import *
import json, csv

app = Flask(__name__, static_url_path='')

@app.route('/')
def index():
    return app.send_static_file('index.html')

topo = {}
with open('static/dataset/caCountiesTopoSimple.json') as f:
    topo = json.loads( f.read() )

@app.route('/caCountiesTopoSimple')
def topo_json():
    return jsonify( topo )  

gini = {}
with open('static/dataset/GINI.json') as f:
    gini = json.loads( f.read() )

@app.route('/gini')
def get_gini():
    return jsonify( gini )  

if __name__ == '__main__':
    app.run(host='0.0.0.0',port='9999')
    