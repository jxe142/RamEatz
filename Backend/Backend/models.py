from flask_sqlalchemy import SQLAlchemy
from app import app

db = SQLAlchemy(app)


'''
    Objects that needed to made:
        Orders(need to have filds to check what queue it is in)
        Items for inventory
        popular meals for socail
        questions
        promos
'''


class Students(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed
    decliningBal = db.Column(db.Float)
    mealSwipes = db.Column(db.Integer)

    '''
     Need a one to many realtionship of orders
        # This includes a feild for meals for isFavoirte
        # Need to be albe to get meals by timestamp to sort
    # Need a one to many realtionship of Vendor Questions
    # Need a one to many realtionship of Dev Questions
    '''

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __reper__(self):
        return '<User %r>' % self.username


class Cooks(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed

    '''
        *Needs a forigetn key to the meals that they choose to cook and not
        what other cooks are making
        *Needs a forigen key to the vendor they work for so can only see meals
        from that vendor
    '''

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __reper__(self):
        return '<User %r>' % self.username


class Devs(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed

    '''
        *They are the super suers of the system and can add and remvoe users
        *Needs a key to the queston that they have answered
            Note they still can see all the questions however

    '''

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __reper__(self):
        return '<User %r>' % self.username


class vendors(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed
    storeName = db.Column(db.String(120))

    '''
        *Needs to have a key to its meneu 1 to 1
        *Need to be linked to their promotions
        *Need to be conntected with all the items in their inventory Many to Many
        
    '''

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def __reper__(self):
        return '<User %r>' % self.username
