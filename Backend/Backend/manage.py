from app import app, db
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

migrate = Migrate(app, db)
manager = Manager(app)

manager.add_command('db', MigrateCommand)

# Migration of database :)
# Initialize Alembic (Not needed) : python3 manage.py db init
# Migrate : python3 manage.py db migrate
# Apply Upgrades : python3 manage.py db upgrade

if __name__ == '__main__':
    manager.run()
