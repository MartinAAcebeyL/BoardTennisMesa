from flask import Flask,render_template
app = Flask(__name__)

@app.route('/')
def login():
    return 'Hello World!'

@app.route('/board')
def board_ping_pong():
    return render_template('board.html')
 
if __name__ == '__main__':
    app.run(debug=True)