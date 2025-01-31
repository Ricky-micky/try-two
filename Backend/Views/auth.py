from flask import jsonify, request, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime, timezone
from models import db, User
from werkzeug.security import check_password_hash

BLOCKLIST = set()
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    email = request.json.get('email')
    password = request.json.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "email": user.email,
                "role": user.role
            },
            "access_token": access_token
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@auth_bp.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    BLOCKLIST.add(jti)
    # now = datetime.now(timezone.utc)
    # db.session.add(TokenBlocklist(jti=jti, created_at=now))
    # db.session.commit()
    return jsonify({"success": "Logged out successfully"}), 200

