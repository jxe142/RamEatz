from flask_restplus import reqparse

pagination_arguments = reqparse.RequestParser()
pagination_arguments.add_argument('page', type=int, required=False)
pagination_arguments.add_argument('per_page', type=int, required=False,
                                  choices=[5, 10, 20, 30, 40, 50], default=10)
