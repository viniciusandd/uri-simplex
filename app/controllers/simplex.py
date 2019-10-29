from flask import request, jsonify
import numpy as np
from app import app

@app.route('/simplex/iniciar', methods=['POST'])
def iniciar_simplex():
    json = request.get_json()
    
    funcao_objetivo = json['funcao_objetivo'] # string
    restricoes = json['restricoes'] # array de strings

    equacao = ""
    equacao += preparar_funcao_objetivo(funcao_objetivo, len(restricoes))
    equacao += adicionar_variaveis_de_folga_nas_restricoes(restricoes)

    print(equacao)
    # tabela = np.fromstring(equacao, dtype=str, sep=' ')
    # print(tabela)

    return jsonify({"status":1})

def preparar_funcao_objetivo(funcao_objetivo, len_restricoes):
    list_valores = funcao_objetivo.split('+')    
    for i in range(len(list_valores)):
        list_valores[i] = '-%s' % list_valores[i]

    variaveis_de_folga = criar_variaveis_de_folga(len_restricoes)
    return '%s%s0\n' % (' '.join(list_valores), variaveis_de_folga)

def criar_variaveis_de_folga(len_restricoes):
    variaveis_de_folga = ""
    for i in range(len_restricoes):
        variaveis_de_folga += ' +0xF%s' % (i + 1)
    variaveis_de_folga += ' = '
    return variaveis_de_folga

def adicionar_variaveis_de_folga_nas_restricoes(list_restricoes):
    variaveis_de_folga = criar_variaveis_de_folga(len(list_restricoes))
    str_restricoes = ""
    for i in range(len(list_restricoes)):
        arr_variaveis_de_folga = variaveis_de_folga.split()        
        arr_variaveis_de_folga[i] = '+1xF%s' % (i + 1)
        str_restricoes += '%s\n' % list_restricoes[i].replace(' <= ', ' %s' % ' '.join(arr_variaveis_de_folga))
    return str_restricoes

def montar_tabela():
    pass
