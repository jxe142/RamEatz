from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask import request, redirect
from models import *

app = Flask(__name__)  # The app itself
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://joelevans:@localhost/rameatz'
db = SQLAlchemy(app)  # The database instance
app.debug = True
# db.create_all()


@app.route('/')
def index():
    return "Hello World"


@app.route('/post_user', methods=['GET', 'POST'])
def post_user():
    user = Users('test', 'test@mail')  # make object
    db.session.add(user)  # save to database
    db.session.commit()
    return "Hi"


if __name__ == '__main__':
    app.run()
