from flask import request, jsonify, render_template
import numpy as np
from json import loads
from operator import itemgetter
from app import app

@app.route('/', methods=['GET'])
def index():
     return render_template('index.html')

@app.route('/simplex/iniciar', methods=['POST'])
def main():
    json = request.get_json()
    
    variaveis       = json['variaveis']
    funcao_objetivo = json['funcao_objetivo']
    restricoes      = json['restricoes']
    
    tabela = criar_tabela(funcao_objetivo, restricoes)

    retorno = []
    while True:
        simplex = iniciar_simplex(tabela, variaveis)
        retorno.append(simplex)
        if simplex['solucao_otima']:
            break
        else:
            tabela = simplex['nova_tabela']

    return jsonify(retorno)

def criar_tabela(funcao_objetivo, restricoes):
    np_funcao_objetivo = np.array([funcao_objetivo])
    np_restricoes = np.array(restricoes)
    tabela = np.concatenate((np_funcao_objetivo, np_restricoes), axis=0)    
    return tabela.tolist()

def iniciar_simplex(tabela, variaveis):    
    coluna_que_entra          = achar_coluna_que_entra(tabela)
    linha_que_sai             = achar_linha_que_sai(tabela, coluna_que_entra)
    elemento_pivo             = achar_elemento_pivo(tabela, coluna_que_entra, linha_que_sai)
    nova_linha_pivo           = calcular_nova_linha_pivo(tabela, linha_que_sai, elemento_pivo)    
    nova_tabela, novas_linhas = calcular_novas_linhas(tabela, coluna_que_entra, linha_que_sai, nova_linha_pivo)
    valor_variaveis           = achar_variaveis(nova_tabela, variaveis)
    solucao_otima             = verificar_solucao_otima(nova_tabela[0])
    
    json = {}
    json['tabela']           = tabela
    json['coluna_que_entra'] = coluna_que_entra
    json['linha_que_sai']    = tabela[linha_que_sai]
    json['elemento_pivo']    = elemento_pivo
    json['nova_linha_pivo']  = nova_linha_pivo
    json['novas_linhas']     = novas_linhas
    json['nova_tabela']      = nova_tabela
    json['variaveis']        = variaveis
    json['valor_variaveis']  = valor_variaveis
    json['solucao_otima']    = solucao_otima
    return json

def achar_coluna_que_entra(tabela):
    linha_z = tabela[0]
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

def calcular_nova_linha_pivo(tabela, linha_que_sai, elemento_pivo):
    nova_linha_pivo = []
    linha_pivo = tabela[linha_que_sai]
    for elemento in linha_pivo:
        nova_linha_pivo.append(float("{0:.2f}".format(elemento / elemento_pivo)))
    return nova_linha_pivo

def calcular_novas_linhas(tabela, coluna_que_entra, linha_que_sai, nova_linha_pivo):
    nova_tabela = []
    novas_linhas = []
    for i in range(len(tabela)):
        if i != linha_que_sai:
            elementos_multiplicados = []
            linha = tabela[i]
            multiplicador = linha[coluna_que_entra] * -1
            
            for elemento in nova_linha_pivo:
                elementos_multiplicados.append(float("{0:.2f}".format(elemento * multiplicador)))

            nova_linha = []
            for i in range(len(linha)):
                soma = elementos_multiplicados[i] + linha[i]
                nova_linha.append(soma)            
            nova_tabela.append(nova_linha)
            novas_linhas.append(nova_linha)
        else:
            nova_tabela.append(nova_linha_pivo)
    return nova_tabela, novas_linhas

def achar_variaveis(tabela, variaveis):
    index_linha  = 0
    index_coluna = 0
    coluna  = ''
    colunas = []
    for i in range(len(tabela) * len(variaveis)):
        linha = tabela[index_linha]
        coluna += "%s " % linha[index_coluna]
        if index_linha == len(tabela)-1:
            colunas.append(coluna.strip().split())
            coluna = ''
            index_coluna = index_coluna + 1
            index_linha = 0
        else:
            index_linha = index_linha + 1        
    
    dict_variaveis = {}
    dict_basicas = {}
    dict_nao_basicas = {}
    for i in range(len(colunas)):         
        if i > 0 and i < len(variaveis)-1:
            c = colunas[i]
            variavel = variaveis[i]
            if c.count('1.0') == 1 and c.count('0.0') == (len(c)-1):
                posicao_do_1 = c.index('1.0')
                valor_independente = tabela[posicao_do_1][len(variaveis)-1]
                dict_basicas[variavel] = valor_independente
            else:                
                dict_nao_basicas[variavel] = 0
    dict_variaveis['basicas'] = dict_basicas
    dict_variaveis['nao_basicas'] = dict_nao_basicas
    dict_variaveis['z'] = tabela[0][len(variaveis)-1]
    return dict_variaveis

def verificar_solucao_otima(linha_z):
    cont_negativos = 0
    for elemento in linha_z:
        if float(elemento) < 0.0:            
            cont_negativos = cont_negativos + 1
            break
    if cont_negativos > 0:
        return False

    return True
