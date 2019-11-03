from flask import request, jsonify
import numpy as np
from json import loads
from operator import itemgetter
from app import app

@app.route('/simplex/iniciar', methods=['POST'])
def iniciar_simplex():
    json = request.get_json()
    
    variaveis       = json['variaveis']
    funcao_objetivo = json['funcao_objetivo']
    restricoes      = json['restricoes']

    np_funcao_objetivo = np.array([funcao_objetivo])
    np_restricoes = np.array(restricoes)
    tabela = np.concatenate((np_funcao_objetivo, np_restricoes), axis=0)
    # print(tabela)

    coluna_que_entra = achar_coluna_que_entra(tabela)
    linha_que_sai    = achar_linha_que_sai(tabela, coluna_que_entra)
    print(coluna_que_entra)
    print(linha_que_sai)
    elemento_pivo = achar_elemento_pivo(tabela, coluna_que_entra, linha_que_sai)
    print(elemento_pivo)

    return jsonify({"status":1})

def achar_coluna_que_entra(tabela):
    linha_z = tabela[0].tolist()
    menor_valor_absoluto = sorted(linha_z)[0]
    posicao_menor_valor_absoluto = linha_z.index(menor_valor_absoluto)
    return posicao_menor_valor_absoluto

def achar_linha_que_sai(tabela, coluna_que_entra):
    divisoes = []
    for i in range(len(tabela)):        
        if i > 0:
            linha = tabela[i]
            resultado = linha[len(linha)-1] / linha[coluna_que_entra]
            if resultado > 0:
                obj = {
                    "posicao": i,
                    "resultado": resultado
                }
                divisoes.append(obj)

    return sorted(divisoes, key=itemgetter('resultado'))[0]['posicao']    

def achar_elemento_pivo(tabela, coluna_que_entra, linha_que_sai):
    return tabela[linha_que_sai][coluna_que_entra]