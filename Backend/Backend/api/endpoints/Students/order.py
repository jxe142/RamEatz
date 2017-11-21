# from models import *  # import the modles that we nee
# from app import db, api, app  # Import the database we need
#
# ns = api.namespace('students/orders', description='Operations related to student orders')
#
#
# @app.route('/orders')
# class OrdersCollection(Resource):
#
#     def get(self):
#         """Returns list of all the students orders"""
#
#         # Get the student ID from the request and then find all orders
#         orders = Orders.query.filter_by(student=1).all()
#         return get_all_categories()
#
#     @api.response(201, 'Category successfully created.')
#     def post(self):
#         """Creates a new blog category."""
#         create_category(request.json)
#         return None, 201
#
#
# @ns.route('/<int:id>')
# @api.response(404, 'Category not found.')
# class CategoryItem(Resource):
#
#     def get(self, id):
#         """Returns details of a category."""
#         return get_category(id)
#
#     @api.response(204, 'Category successfully updated.')
#     def put(self, id):
#         """Updates a blog category."""
#         update_category(id, request.json)
#         return None, 204
#
#     @api.response(204, 'Category successfully deleted.')
#     def delete(self, id):
#         """Deletes blog category."""
#         delete_category(id)
#         return None, 204
