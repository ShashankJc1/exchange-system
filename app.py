from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Configurations
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///exchange_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

class ExchangeOffer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    item_name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.now())

# Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful', 'user_id': user.id})
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/post_offer', methods=['POST'])
def post_offer():
    data = request.json
    new_offer = ExchangeOffer(user_id=data['user_id'], item_name=data['item_name'], description=data['description'])
    db.session.add(new_offer)
    db.session.commit()
    return jsonify({'message': 'Offer posted successfully'})

@app.route('/offers', methods=['GET'])
def get_offers():
    offers = ExchangeOffer.query.all()
    return jsonify([{'id': offer.id, 'user_id': offer.user_id, 'item_name': offer.item_name, 'description': offer.description, 'created_at': offer.created_at} for offer in offers])

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
