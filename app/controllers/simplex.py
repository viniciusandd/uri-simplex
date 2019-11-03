from flask import request, jsonify
import numpy as np
from json import loads
from app import app

@app.route('/simplex/iniciar', methods=['POST'])
def iniciar_simplex():
    json = request.get_json()
    
    variaveis = json['variaveis']
    funcao_objetivo = json['funcao_objetivo']
    restricoes = json['restricoes']

    np_funcao_objetivo = np.array([funcao_objetivo])
    np_restricoes = restricoes
    tabela = np.concatenate((np_funcao_objetivo, np_restricoes), axis=0)

    print(tabela)

    return jsonify({"status":1})

def achar_linha_que_entra(tabela):
    pass

def achar_linha_que_sai():
    pass
