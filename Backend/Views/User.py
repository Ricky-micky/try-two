from flask import jsonify, request, Blueprint
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token

user_bp = Blueprint('user_bp', __name__)

# Register User
@user_bp.route('/login', methods=['POST'],endpoint = 'user_login')
def login():
    email = request.json.get('email', None)
    password = request.json.get('password', None)
    
    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):  # Assuming you have a check_password method
        access_token = create_access_token(identity=user.id)  # Create JWT token
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'role': user.role,
                'name': user.name
            },
            'access_token': access_token
        }), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# Login User
@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"error": "Invalid email or password"}), 401

    access_token = create_access_token(identity=user.user_id)
    return jsonify({"access_token": access_token}), 200

# Fetch Current User
@user_bp.route('/current_user', methods=['GET'])
@jwt_required()
def current_user():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"email": user.email, "role": user.role}), 200

# Get All Users
@user_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    users = User.query.all()
    return jsonify([{ "id": user.user_id, "email": user.email, "role": user.role } for user in users]), 200

# Get User by ID
@user_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.user_id, "email": user.email, "role": user.role}), 200

# Update User
@user_bp.route('/users/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    data = request.get_json()
    if "email" in data:
        user.email = data["email"]
    if "password" in data:
        user.password = generate_password_hash(data["password"])
    if "role" in data:
        user.role = data["role"]
    
    db.session.commit()
    return jsonify({"message": "User updated successfully"}), 200

# Delete User
@user_bp.route('/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully"}), 200
