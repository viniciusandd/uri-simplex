# Algoritmo Simplex

## Etapas do algoritmo

- Recebe as entradas do usuário (equação)
- Prepara a função objetivo
- Adiciona as variáveis de folga nas restrições
- Cria a tabela
- Acha a coluna que entra
- Acha a linha que sai
- Encontra o elemento pivô
- Calcula a nova linha pivô
- Calcula as demais linhas
- Encontra as variáveis básicas, as variáveis não básicas e o valor de Z
- Verifica se deve iniciar uma nova iteração...

## Json

### Esperado

```
{
	"variaveis": ["Z", "x1", "x2", "xF1", "xF2", "xF3", "b"],
	"funcao_objetivo": [1, -120, -160, 0, 0, 0, 0],
	"restricoes": [
		[0, 4, 2, 1, 0, 0, 28],
		[0, 3, 9, 0, 1, 0, 45],
		[0, 3, 5, 0, 0, 1, 30]
	]
}
```

### Retornado

```
[
	{
		"tabela": [],
		"coluna_que_entra": "",
		"linha_que_sai": "",
		"elemento_pivo": "",
		"nova_tabela": [],
	    "variaveis": {
	        "x1": 0, 
	        "x2": 5.0, 
	        "xF2": 0, 
	        "xF1": 18.0, 
	        "xF3": 5.0
	    }
	}
]
```