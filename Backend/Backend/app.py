from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask import request, redirect
from flask_restplus import Api, Resource, Namespace
from functools import wraps
import os
import jwt
import datetime


#==============================================================
# Config of the app
#==============================================================
app = Flask(__name__)  # Makes the flask app
db = SQLAlchemy(app)  # Makes our postgresql database
api = Api(app)  # Makes a flask restplus api
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://joelevans:@localhost/rameatz'
SECRET_KEY = os.urandom(24)
app.config['SECRET_KEY'] = SECRET_KEY
auth = HTTPBasicAuth()
from models import *  # Get all the parts of the database we need

#==============================================================
# Auth
#==============================================================


def token_needed(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        # Get the token
        token = None

        if 'token' in request.headers:
            token = request.headers['token']

        if not token:
            return make_response('No token provided!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})
        # see if token is vaild
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            currentUser = Students.query.filter_by(username=data['user']).first()
            return f(currentUser, *args, **kwargs)
        except:
            pass

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            currentUser = Vendors.query.filter_by(username=data['user']).first()
            return f(currentUser, *args, **kwargs)
        except:
            return make_response('Token is invaild!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})

        return f(currentUser, *args, **kwargs)

    return decorated


@app.route('/login')
def login():
    aut = request.authorization  # Gives use the username and password sent

    if(not aut or not aut.username or not aut.password):  # No usrname no password, or either
        return make_response('Could not verify!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})

    try:
        user = Students.query.filter_by(username=aut.username).first()
        if(user.password == aut.password):  # if the passwords matach
            token = jwt.encode({
                'user': aut.username,  # Tells who the user is
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)  # make it expire after 30 minutes
            }, app.config['SECRET_KEY'])
            return jsonify({'token': token.decode('UTF-8')})
    except:
        pass

    try:
        user = Vendors.query.filter_by(username=aut.username).first()
    except:
        pass

    if(not user):
        return make_response('Could not verify!!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})

    if(user.password == aut.password):  # if the passwords matach
        token = jwt.encode({
            'user': aut.username,  # Tells who the user is
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)  # make it expire after 30 minutes
        }, app.config['SECRET_KEY'])
        return jsonify({'token': token.decode('UTF-8')})
        # return make_response

        return make_response('Could not verify!!!', 401, {'WWW-Authenticate': 'Basic realm="Login Required"'})


# These are test to make sure that the token auth works
@app.route('/hello')
def tryFunctions():
    return jsonify({'message': 'anyone can see'})


@app.route('/helloPro')
@token_needed
def try2(currentUser):
    return jsonify({'message': 'only a few can see'})


#==============================================================
# Making Name spaces for the APIS
#==============================================================
orders_api = Namespace('orders')
api.add_namespace(orders_api)


@orders_api.route('/')
class OrdersList(Resource):
    # @orders_api.response(UserSchema(many=True))
    @token_needed
    def get(currentUser, self):
        student = Students.query.first()
        # return jsonify(student.as_dict())
        return ''


@orders_api.route('/<int:user_id>')
# @orders_api.resolve_object('user', lambda kwargs: User.query.get_or_404(kwargs.pop('user_id')))
class ordersByID(Resource):

    # @users_api.response(UserSchema())
    def get(self, user):
        return user


@app.route('/burgerStudio')
def makeVendors():
    burgerStudio = Vendors('BurgerStudio', 'BurgerStudio@mail.com',
                           'burgerPassword', 'Burger Studio')
    db.session.add(burgerStudio)
    db.session.commit()
    return 'It worked'

    # @app.route('/post_user', methods=['GET', 'POST'])
    # def post_user():
    #     user = Users('test', 'test@mail')  # make object
    #     db.session.add(user)  # save to database
    #     db.session.commit()
    #     return "Hi"

    # @app.route('/post_user', methods=['GET', 'POST'])
    # def post_user():
    #     user = Users('test', 'test@mail')  # make object
    #     db.session.add(user)  # save to database
    #     db.session.commit()
    #     return "Hi"


@app.route('/burgerStudio/comp')
def makeComponents():
    vendor = Vendors.query.filter_by(s='Burger Studio').first()

    # Buns
    whiteBun = Components('White Bun', vendor.id, 100, 0)
    db.session.add(whiteBun)

    wheatBun = Components('Wheat Bun', vendor.id, 100, 0)
    db.session.add(wheatBun)

    noBun = Components('No Bun', vendor.id, 100, 0)
    db.session.add(noBun)

    # Cheeses
    american = Components('American Cheese', vendor.id, 100, 0)
    db.session.add(american)

    cheddar = Components('Cheddar Cheese', vendor.id, 100, 0)
    db.session.add(cheddar)

    swiss = Components('Swiss Cheese', vendor.id, 100, 0)
    db.session.add(swiss)

    pepperJack = Components('Pepper Jack Cheese', vendor.id, 100, 0)
    db.session.add(pepperJack)

    provolone = Components('Provolone Cheese', vendor.id, 100, 0)
    db.session.add(provolone)

    # Toppings
    bacon = Components('Bacon', vendor.id, 100, 1)
    db.session.add(bacon)

    doubleBacon = Components('Double Bacon', vendor.id, 100, 2)
    db.session.add(doubleBacon)

    firedEgg = Components('Fried Egg', vendor.id, 100, 1)
    db.session.add(firedEgg)

    guacamole = Components('Guacamole', vendor.id, 100, 1)
    db.session.add(guacamole)

    icebertgLettuce = Components('Icebertg Lettuce', vendor.id, 100, 0)
    db.session.add(icebertgLettuce)

    tomato = Components('Tomato', vendor.id, 100, 0)
    db.session.add(tomato)

    pickles = Components('Pickles', vendor.id, 100, 0)
    db.session.add(pickles)

    redOnions = Components('Red Onions', vendor.id, 100, 0)
    db.session.add(redOnions)

    carmOnions = Components('Carmelized Onions', vendor.id, 100, 0)
    db.session.add(carmOnions)

    sauteedMush = Components('Sauteed Muchrooms', vendor.id, 100, 0)
    db.session.add(sauteedMush)

    sauttedBellPeppers = Components('Sauteed Bell Peppers', vendor.id, 100, 0)
    db.session.add(sauttedBellPeppers)

    jalapenos = Components('Jalapenos', vendor.id, 100, 0)
    db.session.add(jalapenos)

    salsa = Components('Salsa', vendor.id, 100, 0)
    db.session.add(salsa)

    picoDeGallo = Components('Pico De Gallo', vendor.id, 100, 1)
    db.session.add(salsa)

    db.session.commit()

    return vendor.username


if __name__ == '__main__':
    app.run(debug=True)
