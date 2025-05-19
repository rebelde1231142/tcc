from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Permite requisições do front-end

# Usuário de exemplo
USERS = {
    "teste@exemplo.com": "senha123"
}

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if USERS.get(email) == password:
        return jsonify({"message": "Login realizado com sucesso!"})
    return jsonify({"message": "Email ou senha inválidos."}), 401

if __name__ == '__main__':
    app.run(debug=True)