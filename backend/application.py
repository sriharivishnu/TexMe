from flask import Flask, request
import json
import os
# import boto3

app = Flask(__name__)


@app.route('/', methods=['GET'])
def root():
    return 'Welcome to TexMe API'


@app.route('/latex', methods=['POST'])
def generate_latex():
    data = request.json
    return data


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
