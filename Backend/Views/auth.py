from flask import jsonify, request, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity,get_jwt
from datetime import datetime, timezone
from models import db, User
from werkzeug.security import check_password_hash

BLOCKLIST = set()
auth_bp = Blueprint('auth_bp', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.user_id)
        return jsonify({"access_token": access_token}), 200
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

