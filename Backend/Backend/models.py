import datetime
from app import db
import random 


'''
    Objects that needed to made:
        Note to
        Orders(need to have filds to check what queue it is in)
        Items for inventory
        questions
        promos
'''

# Note Might need to refacotr the users so they inheirht form the same parent class


class Students(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    firstName = db.Column(db.String(80))
    lastName = db.Column(db.String(80))
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

    def __init__(self, username, email, password, firstName, lastName):
        self.username = username
        self.email = email
        self.password = password
        self.firstName = firstName
        self.lastName = lastName

    def __reper__(self):
        return '<User %r>' % self.username

    def checkMealSwipes(self):
        return self.mealSwipes

    def checkDC(self):
        return self.decliningBal

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Vendors(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed
    storeName = db.Column(db.String(120), unique=True)
    items = db.relationship("Items", backref='vendorItems', lazy=True)
    components = db.relationship("Components", backref='vendorComponents', lazy=True)
    meneuItems = db.relationship("MeneuItems", backref='vendorMeneuItems', lazy=True)

    def __init__(self, username, email, password, storeName):
        self.username = username
        self.email = email
        self.password = password
        self.storeName = storeName

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

    '''
        *Needs to have a key to its meneu 1 to 1
        *Need to be linked to their promotions
        *Need to be conntected with all the items in their inventory Many to Many

    '''

class Cooks(db.Model):
    # neeed to chagne this os it is a UUID
    id = db.Column(db.Integer, primary_key=True)

    username = db.Column(db.String(80), unique=True)
    email = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))  # needs to be hashed
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)

    '''
        *Needs a forigetn key to the meals that they choose to cook and not
        what other cooks are making
    '''

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# Many to Many realtionship between Meals and Items
orderItems = db.Table('orderItems',
                      db.Column('id', db.Integer, primary_key = True),
                      db.Column('orderID', db.Integer, db.ForeignKey(
                          'orders.id')),
                      db.Column('itemID', db.Integer, db.ForeignKey(
                          'items.id'))
                      )


class Orders(db.Model, object):
    id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.Integer, db.ForeignKey(
        'students.id'), nullable=False)
    cook = db.Column(db.Integer, db.ForeignKey('cooks.id'))
    inProgress = db.Column(db.Boolean, default=False)
    isComplete = db.Column(db.Boolean, default=False)
    price = db.Column(db.Float)
    confirm = db.Column(db.Integer, unique=True) #write the logic to get the order
    isFav = db.Column(db.Boolean, default=False)
    isConfirm = db.Column(db.Boolean, default=False) 
    timeStamp = db.Column(db.DateTime, default=datetime.datetime.utcnow, index=True)
    items = db.relationship('Items', secondary=orderItems,
                            lazy='subquery', backref=db.backref('orders', lazy=True))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class MeneuItems(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    price = db.Column(db.Float)
    name = db.Column(db.String(120))

    def __init__(self, vendor, price, name):
        self.vendor = vendor
        self.price = price
        self.name = name
    
    
    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



# Many to Many realtionship between Meals and Items
itemComponents = db.Table('itemComponents',
                          db.Column('id', db.Integer, primary_key = True),
                          db.Column('componentsID', db.Integer, db.ForeignKey(
                              'components.id')),
                          db.Column('itemID', db.Integer, db.ForeignKey(
                              'items.id'))

                          )


class Items(db.Model):  # EX buns, paty, etc
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    description = db.Column(db.String(200))
    price = db.Column(db.Float)
    components = db.relationship('Components', secondary=itemComponents, lazy='subquery',
                                 backref=db.backref('itemsComp', lazy=True))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Components(db.Model):  # EX buns, paty, etc
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True)
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    stock = db.Column(db.Integer)
    description = db.Column(db.String(200))
    price = db.Column(db.Float)

    def __init__(self, name, vendor, stock, price):
        self.name = name
        self.vendor = vendor
        self.stock = stock
        self.price = price

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

# class Devs(db.Model):
#     # neeed to chagne this os it is a UUID
#     id = db.Column(db.Integer, primary_key=True)

#     username = db.Column(db.String(80), unique=True)
#     email = db.Column(db.String(120), unique=True)
#     password = db.Column(db.String(120))  # needs to be hashed

#     '''
#         *They are the super suers of the system and can add and remvoe users
#         *Needs a key to the queston that they have answered
#             Note they still can see all the questions however

#     '''

#     def __init__(self, username, email, password):
#         self.username = username
#         self.email = email
#         self.password = password

#     def __reper__(self):
#         return '<User %r>' % self.username

#     def __init__(self, username, email, password):
#         self.username = username
#         self.email = email
#         self.password = password

#     def __reper__(self):
#         return '<User %r>' % self.username
