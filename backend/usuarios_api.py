from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Simulação de "banco de dados" de usuários
usuarios = [
    {"id": 1, "email": "leonel@gmail.com", "senha": "1234"},
    {"id": 2, "email": "admin@exemplo.com", "senha": "admin"}
]

# Retorna todos os usuários (para teste, não use em produção)
@app.route('/api/usuarios', methods=['GET'])
def get_usuarios():
    return jsonify([{"id": u["id"], "email": u["email"]} for u in usuarios])

# Adiciona um novo usuário
@app.route('/api/usuarios', methods=['POST'])
def add_usuario():
    data = request.get_json()
    novo_id = max([u["id"] for u in usuarios], default=0) + 1
    usuario = {
        "id": novo_id,
        "email": data.get("email"),
        "senha": data.get("senha")
    }
    usuarios.append(usuario)
    return jsonify({"id": usuario["id"], "email": usuario["email"]}), 201

# Autenticação de login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    senha = data.get('password')
    for usuario in usuarios:
        if usuario["email"] == email and usuario["senha"] == senha:
            return jsonify({"message": "Login realizado com sucesso!"})
    return jsonify({"message": "Email ou senha inválidos."}), 401

if __name__ == '__main__':
    app.run(debug=True)