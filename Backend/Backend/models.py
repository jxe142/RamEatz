from app import db

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

    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

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
    meals = db.relationship("Meal", backref='vendorMeals', lazy=True)

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


# Many to Many realtionship between Meals and Items
orderMeals = db.Table('orderMeals',
                      db.Column('orderID', db.Integer, db.ForeignKey(
                          'orders.id'), primary_key=True),
                      db.Column('mealID', db.Integer, db.ForeignKey(
                          'meal.id'), primary_key=True),
                      )

orderItems = db.Table('orderItems',
                      db.Column('orderID', db.Integer, db.ForeignKey(
                          'orders.id'), primary_key=True),
                      db.Column('itemID', db.Integer, db.ForeignKey(
                          'items.id'), primary_key=True)
                      )


class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student = db.Column(db.Integer, db.ForeignKey(
        'students.id'), nullable=False)
    price = db.Column(db.Float)
    meals = db.relationship('Meal', secondary=orderMeals,
                            lazy='subquery', backref=db.backref('orders', lazy=True))
    items = db.relationship('Items', secondary=orderItems,
                            lazy='subquery', backref=db.backref('orders', lazy=True))

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


# Many to Many realtionship between Meals and Items
mealItems = db.Table('mealItems',
                     db.Column('mealID', db.Integer, db.ForeignKey(
                         'meal.id'), primary_key=True),
                     db.Column('itemID', db.Integer, db.ForeignKey(
                         'items.id'), primary_key=True)

                     )

mealComponents = db.Table('mealComponents',
                          db.Column('componentsID', db.Integer, db.ForeignKey(
                              'components.id'), primary_key=True),
                          db.Column('mealID', db.Integer, db.ForeignKey(
                              'meal.id'), primary_key=True),

                          )


class Meal(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    price = db.Column(db.Float)
    items = db.relationship('Items', secondary=mealItems,
                            lazy='subquery', backref=db.backref('meal', lazy=True))
    components = db.relationship('Components', secondary=mealComponents,
                                 lazy='subquery', backref=db.backref('items', lazy=True))

    def __init__(self, vendor, price):
        self.vendor = vendor
        self.price = price

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}



# Many to Many realtionship between Meals and Items
itemComponents = db.Table('itemComponents',
                          db.Column('componentsID', db.Integer, db.ForeignKey(
                              'components.id'), primary_key=True),
                          db.Column('itemID', db.Integer, db.ForeignKey(
                              'items.id'), primary_key=True)

                          )


class Items(db.Model):  # EX buns, paty, etc
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    vendor = db.Column(db.Integer, db.ForeignKey('vendors.id'), nullable=False)
    stock = db.Column(db.Integer)
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

# class Cooks(db.Model):
#     # neeed to chagne this os it is a UUID
#     id = db.Column(db.Integer, primary_key=True)

#     username = db.Column(db.String(80), unique=True)
#     email = db.Column(db.String(120), unique=True)
#     password = db.Column(db.String(120))  # needs to be hashed

#     '''
#         *Needs a forigetn key to the meals that they choose to cook and not
#         what other cooks are making
#         *Needs a forigen key to the vendor they work for so can only see meals
#         from that vendor
#     '''

#     def __init__(self, username, email, password):
#         self.username = username
#         self.email = email
#         self.password = password

#     def __reper__(self):
#         return '<User %r>' % self.username


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
