from flask import Flask, jsonify, request, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_httpauth import HTTPBasicAuth
from flask import request, redirect, Response
from flask_restplus import Api, Resource, Namespace
from functools import wraps
import jsonpickle
import os
import json
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
            currentUser = Students.query.filter_by(
                username=data['user']).first()
        except:
            pass

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            currentUser = Vendors.query.filter_by(
                username=data['user']).first()
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
                # make it expire after 30 minutes
                #'exp': datetime.datetime.utcnow() + datetime.timedelta()
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
            # make it expire after 30 minutes
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=30)
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

@app.route('/quick', methods=['GET', 'POST'])
def quick():
    print(request.get_json)
    return ''


@orders_api.route('/')
class OrdersList(Resource):

    # @token_needed  # Get the all the past orders for that student
    def get(self):
        # myOrders = Orders.
        user = request.headers['id']
        jSon = '{'
        count = 1 

        myOrders = Orders.query.order_by(Orders.timeStamp.desc()).all()

        for order in myOrders:
            jSon += ' "order'+str(count)+ '": ['
            jSon += json.dumps(order.as_dict(),sort_keys=True, default=str)
            jSon = jSon[:-1] + ','


            items = order.items
            icount = 1
            for i in items:
                jSon += '"item'+str(icount)+'": ['
                jSon += json.dumps(i.as_dict(), sort_keys=True, default=str)
                jSon = jSon[:-1] + ', "comps": [{'
                
                comps = i.components
                ccount = 1
                for c in comps:
                    jSon += '"comp'+str(ccount)+'": ['
                    jSon += json.dumps(c.as_dict(), sort_keys=True, default=str)
                    ccount += 1
                    if(ccount != len(comps)+1):
                        jSon += '],'
                    else:
                        jSon += ']}]}'

                icount += 1
                if(icount != len(items)+1):
                    jSon += '],'
                else:
                    jSon += ']'

        
            count += 1
            if(count != len(myOrders)+1):
                jSon += '}],'
            else:
                jSon += '}]'
                

        jSon += '}'

        jSon.replace('"\"', "")
        print(jSon)
        return Response(jSon,  mimetype='application/json')
        

    # @token_needed  # Make the order for that student
    # def post(currentUser, self):
    def post(self):
        data = request.get_json()
        items = []
        comps = []

        newOrder = Orders()

        num = random.randint(1, 10000000)
        newOrder.confirm = int(num)

        while(Orders.query.filter_by(confirm=num).first()):
            num = random.randint
            newOrder.confirm = int(num)

        newOrder.student = data['orderInfo'][0]['student']
        newOrder.price = data['orderInfo'][0]['price']

        #Make ites for the order
        for i in range(0, data['orderInfo'][0]['items']):
            # print(data['Item'+ str(i+1)][0]['name'])
            item = Items()
            itemlocation = 'Item'+ str(i+1)
            print(itemlocation)

            item.name = data[itemlocation][0]['name']
            item.vendor = Vendors.query.filter_by(username = data['orderInfo'][0]['vendor']).first().id
            
            for j in range(0, data[itemlocation][0]['numComps']):
                print(j)
                comp = Components.query.filter_by(name= data['Item'+ str(i+1)][0]['comps'][0]['comp' + str(j+1)]).first()
                comps.append(comp)

            item.components = comps 
            items.append(item)

            db.session.add(item)
            db.session.commit()
        
        newOrder.items = items
        db.session.add(newOrder)
        db.session.commit()

        for c in comps:
            c.stock -=1
            db.session.commit()
            


        # for items

        print(data['Item1'][0]['numComps'])
        return data['Item1']


@orders_api.route('/<int:order_id>')
# @orders_api.resolve_object('user', lambda kwargs: User.query.get_or_404(kwargs.pop('user_id')))
class ordersByID(Resource):

     # @token_needed  # Make the order for that student
    # def post(currentUser, self):
    def get(self, order_id):
        count = 1
        jSon = '{'

        try:
            order = Orders.query.filter_by(id=order_id).first()
        except: 
            return make_response('Order does not exist!', 404)


        jSon += ' "order": ['
        jSon += json.dumps(order.as_dict(),sort_keys=True, default=str)
        jSon = jSon[:-1] + ','


        items = order.items
        icount = 1
        for i in items:
            jSon += '"item'+str(icount)+'": ['
            jSon += json.dumps(i.as_dict(), sort_keys=True, default=str)
            jSon = jSon[:-1] + ', "comps": [{'
            
            comps = i.components
            ccount = 1
            for c in comps:
                jSon += '"comp'+str(ccount)+'": ['
                jSon += json.dumps(c.as_dict(), sort_keys=True, default=str)
                ccount += 1
                if(ccount != len(comps)+1):
                    jSon += '],'
                else:
                    jSon += ']}]}'

            icount += 1
            if(icount != len(items)+1):
                jSon += ']'
            else:
                jSon += ']'

            if count == 1:
                jSon += '}],'
                count += 1
        jSon += '}'
        return Response(jSon,  mimetype='application/json')


    def delete(self, order_id):
        try:
            order = Orders.query.filter_by(id=order_id).first()
            orderId = order.id
            db.session.delete(order)
            db.session.commit()
        except:
            return make_response('Order does not exist!', 404)
        return orderId

    def put(self, order_id):
        
        try:
            order = Orders.query.filter_by(id=order_id).first()
        except:
            return make_response('Order does not exist!', 404)


        if(request.form.get('fav') == 'True' ):
            order.isFav = True
            db.session.add(order)
            db.session.commit()
            return make_response('Order add to favs', 200)
        

        try:
            id = request.form.get('student')
            student = Students.query.filter_by(id=id).first()
        except:
            return make_response('Student does not exist!', 404)

        if(request.form.get('confirm') == 'True'):
            #if the order ahs already been confirm
            if order.isConfirm == True:
                return make_response('Order has already be confirmed!', 404)
            
            #if the student gives the wrong confromation number for the order
            elif order.confirm != int(request.form.get('confirmNumber')):
                return make_response('Invalid conformation number!', 404)
            
            #everthing works the way it should
            else:
                order.isConfirm = True
                if(student.decliningBal < order.price):
                    return make_response('You do not have enough money in your account!', 500)
                else:
                    student.decliningBal = student.decliningBal - order.price
                    db.session.add(order)
                    db.session.add(student)
                    db.session.commit()
                    return make_response('Order Confirmed!', 200)
                    
        return make_response('Error', 500)
        

            
            
            

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

@app.route('/post_user', methods=['GET', 'POST'])
def post_user():
    user = Students('jevans116', 'test@mail', 'password', 'Joel', 'Evas')  # make object
    user.decliningBal = 400
    user.mealSwipes = 50
    db.session.add(user)  # save to database
    db.session.commit()
    return "Hi"


@app.route('/burgerStudio/comp')
def makeComponents():
    vendor = Vendors.query.filter_by(username='BurgerStudio').first()

    

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
