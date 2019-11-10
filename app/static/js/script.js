$('#btn-prosseguir').click(function(e) {
    e.preventDefault();

    let qtd_variaveis_decisao = parseInt($('#txt-variaveis-decisao').val());
    let qtd_restricoes = parseInt($('#txt-restricoes').val());

    if (qtd_variaveis_decisao > 0 && qtd_restricoes > 0) {

        $('#div-segunda-etapa').append(
            '<input id="txt-qtd-variaveis-decisao" type="hidden" value="'+qtd_variaveis_decisao+'">' +
            '<input id="txt-qtd-restricoes" type="hidden" value="'+qtd_restricoes+'">'
        );

        let funcao = criar_html(1, qtd_variaveis_decisao, 'txt-funcao');
        $('#div-funcao').append(funcao);

        let restricoes = criar_html(qtd_restricoes, qtd_variaveis_decisao, 'txt-restricao');
        $('#div-restricoes').append(restricoes);

        $('#div-primeira-etapa').hide(500);
        $('#div-segunda-etapa').show(500);
    } else {
        bootbox.alert("Preencha todos os campos com um valor maior que zero!");
    }
});

function criar_html(qtd_forms, qtd_campos, classe) {
    var conteudo = '';
    for (var i=0; i<qtd_forms; i++) {        
        conteudo += '<form class="form-inline">';
        for (var h=1; h<=qtd_campos; h++) {
            let c = classe == 'txt-restricao' ? classe + (i + 1) : classe;
            conteudo += '<div class="form-group mb-2">';
            conteudo += '<input type="text" class="form-control-plaintext ' + c + '">&nbsp;';
            conteudo += '<span class="badge badge-dark">X'+h+'</span>';
            conteudo += '</div>';
            if (h < qtd_forms-1 || h ==1)
                conteudo += ' + ';
        }
        if (qtd_forms > 1) { // restricoes
            conteudo += '<select class="form-control" id="exampleFormControlSelect1">';
            conteudo += '<option><=</option>';
            conteudo += '<option>>=</option>';
            conteudo += '</select>';
            conteudo += '<div class="form-group mb-2">';
            conteudo += '<input id="txt-valor-independente'+(i+1)+'" type="text" class="form-control-plaintext">';
            conteudo += '</div>';
        }        
        conteudo += '</form>'; 
    }
    return conteudo;
}

$('#btn-voltar-primeira-etapa').click(function(e) {
    e.preventDefault();
    $('#div-funcao').html('<label>Qual sua função?</label>');
    $('#div-restricoes').html('<label>Quais suas restrições?</label>');    
    $('#div-segunda-etapa').hide(500);
    $('#div-primeira-etapa').show(500);
});

$('#btn-criar-funcao').click(function(e) {
    e.preventDefault();    

    preparar_funcao();

    $('#div-funcao-pronta').append('');
    $('#div-segunda-etapa').hide(500);    
    $('#div-terceira-etapa').show(500);
});

    // Na função -> Passar os elementos pro lado de Z (ou seja, eles trocam de sinal)
    // Nas restrições -> Adicionar as variáveis de folga
    // Enviar o seguinte json:
    // {
    //     "variaveis": ["Z", "x1", "x2", "xF1", "xF2", "xF3", "b"],
    //     "funcao_objetivo": [1, -120, -160, 0, 0, 0, 0],
    //     "restricoes": [
    //         [0, 4, 2, 1, 0, 0, 28],
    //         [0, 3, 9, 0, 1, 0, 45],
    //         [0, 3, 5, 0, 0, 1, 30]
    //     ]
    // }   

function preparar_funcao() {    
    var qtd_variaveis_decisao = $('#txt-qtd-variaveis-decisao').val();
    var campos = $('.txt-funcao');
    let variaveis = 'Z';    
    let funcao = '1';
    var linha_z = 'Z'
    for (var i=0; i<qtd_variaveis_decisao; i++) {
        linha_z   += ' - ' + campos[i].value + 'x' + (i + 1);
        variaveis += ' x' + (i + 1);
        funcao    += ' -' + campos[i].value;
    }
    linha_z += ' = 0 <br>';    

    var arr_restricoes = [];
    var qtd_restricoes = $('#txt-qtd-restricoes').val();    
    var r = '';
    var outras_linhas = '';
    for (var i=1; i<=qtd_restricoes; i++) {
        r += '0';        
        var restricoes = $('.txt-restricao' + i);   
        var valor_independente = $('#txt-valor-independente'+i).val();     
        for (var h=0; h<qtd_variaveis_decisao; h++) {
            if (h == qtd_variaveis_decisao - 1) {
                outras_linhas += restricoes[h].value + 'x' + (h + 1) + ' + xF' + i + ' = ' + valor_independente + '<br>';
            } else {
                outras_linhas += restricoes[h].value + 'x' + (h + 1) + ' + ';
            }
            r += ' ' + restricoes[h].value;
        }
        variaveis += ' xF' + i;
        funcao += ' 0';
        var v = criar_array_com_zeros(qtd_restricoes);
        v[i - 1] = '1';
        r += ' ' + v.join(' ');
        r += ' ' + valor_independente;
        arr_restricoes.push(r.split(' ').map(x => parseInt(x)));
        r = '';
    }
    variaveis += ' b'    
    funcao += ' 0';
    
    var obj = {
        "variaveis": variaveis.split(' '),
        "funcao_objetivo": funcao.split(' ').map(x => parseInt(x)),
        "restricoes": arr_restricoes
    };

    $('#div-funcao-pronta').append(
        "<p class='lead'>" + linha_z + outras_linhas + "</p>" +
        "<input id='json' value='"+JSON.stringify(obj)+"' type='hidden'>"
    );
}

function criar_array_com_zeros(qtd) {
    var a = [];
    for (var i=0; i<qtd; i++) {
        a.push('0');
    }
    return a;
}

$('#btn-voltar-segunda-etapa').click(function(e) {
    e.preventDefault();
    $('#div-funcao-pronta').html('');
    $('#div-terceira-etapa').hide(500);
    $('#div-segunda-etapa').show(500);
});

$('#btn-calcular').click(function(e) {
    e.preventDefault();
    let json = $('#json').val();
    console.log(json);
    $.ajax({
        url: 'http://localhost:5000/simplex/iniciar',
        method: 'POST',
        data: json,        
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            console.log(data);            
            if (data) {
                $('#div-terceira-etapa').hide(500);
                $('#div-quarta-etapa').show(500);
                var conteudo = '';
                $(data).each(function (index, value) 
                {
                    // PRIMEIRA TABELA
                    if (index == 0) {
                        conteudo += '<h3>Primeira tabela</h3>';
                        conteudo += '<table class="table">';
                        conteudo += '<thead>';
                        conteudo += '<tr>';
                        $(value.variaveis).each(function (index, value) {
                            conteudo += '<td>' + value + '</td>';
                        });
                        conteudo += '</tr>';
                        conteudo += '</thead>';
                        conteudo += '<tbody>';
                        $(value.tabela).each(function (index, linhas) {
                            conteudo += '<tr>';
                            $(linhas).each(function (index, elemento) {
                                conteudo += '<td>' + elemento + '</td>';
                            });
                            conteudo += '</tr>';
                        });
                        conteudo += '</tbody>';
                        conteudo += '</table>';                        
                    }

                    // LINHA PIVO
                    conteudo += '<h3>Calculando a nova linha pivô</h3>';
                    conteudo += '<table class="table">';
                    conteudo += '<tbody>';
                    conteudo += '<tr>';
                    conteudo += '<td><span class="badge badge-secondary">LP</span></td>';
                    $(value.linha_que_sai).each(function (index, elemento) {                        
                        conteudo += '<td>' + elemento + '</td>';
                    });
                    conteudo += '</tr>';

                    conteudo += '<tr>';
                    conteudo += '<td><span class="badge badge-secondary">/ '+ value.elemento_pivo +'</span></td>';
                    conteudo += '</tr>';

                    //NOVA LINHA PIVO
                    conteudo += '<tr>';
                    conteudo += '<td><span class="badge badge-secondary">NLP</span></td>';
                    $(value.nova_linha_pivo).each(function (index, elemento) {                        
                        conteudo += '<td>' + elemento + '</td>';
                    });
                    conteudo += '</tr>';
                    conteudo += '</tbody>';
                    conteudo += '</table>';

                    //NOVAS LINHAS
                    conteudo += '<h3>Calculando as novas linhas</h3>';
                    conteudo += '<table class="table">';
                    conteudo += '<tbody>';                    
                    $(value.novas_linhas).each(function (index, linha) {
                        conteudo += '<tr>';
                        $(linha).each(function (index, elemento) {
                            conteudo += '<td>' + elemento + '</td>';
                        });
                        conteudo += '</tr>';
                    });
                    conteudo += '</tbody>';
                    conteudo += '</table>';                    

                    //NOVA TABELA
                    conteudo += '<h3>Tabela</h3>';
                    conteudo += '<table class="table">';
                    conteudo += '<thead>';
                    conteudo += '<tr>';
                    $(value.variaveis).each(function (index, value) {
                        conteudo += '<td>' + value + '</td>';
                    });
                    conteudo += '</tr>';
                    conteudo += '</thead>';
                    conteudo += '<tbody>';
                    $(value.nova_tabela).each(function (index, linhas) {
                        conteudo += '<tr>';
                        $(linhas).each(function (index, elemento) {
                            conteudo += '<td>' + elemento + '</td>';
                        });
                        conteudo += '</tr>';
                    });
                    conteudo += '</tbody>';
                    conteudo += '</table>';

                    // VALOR DAS VARIAVEIS
                    conteudo += '<h3>Variáveis</h3>';
                    conteudo += '<table class="table">';                
                    conteudo += '<tbody>';
                    conteudo += '<tr>';
                    conteudo += '<td><span class="badge badge-secondary">VB</span></td>';
                    var nome_variaveis = Object.keys(value.valor_variaveis.basicas);
                    $(nome_variaveis).each(function (index, variavel) {
                        conteudo += '<td>' + variavel + ' = ' + value.valor_variaveis.basicas[variavel] + '</td>';
                    });
                    conteudo += '</tr>';

                    conteudo += '<tr>';
                    conteudo += '<td><span class="badge badge-secondary">VNB</span></td>';
                    nome_variaveis = Object.keys(value.valor_variaveis.nao_basicas);
                    $(nome_variaveis).each(function (index, variavel) {
                        conteudo += '<td>' + variavel + ' = ' + value.valor_variaveis.nao_basicas[variavel] + '</td>';
                    });
                    conteudo += '</tr>';

                    conteudo += '<tr>';                    
                    conteudo += '<td><span class="badge badge-secondary">Z</span></td>';
                    conteudo += '<td>'+value.valor_variaveis.z+'</td>';
                    conteudo += '</tr>';

                    conteudo += '<tr>';                    
                    conteudo += '<td><span class="badge badge-secondary">Solução Ótima</span></td>';
                    conteudo += '<td>'+value.solucao_otima+'</td>';
                    conteudo += '</tr>';

                    conteudo += '</tbody>';
                    conteudo += '</table>';
                    conteudo += '<hr>';
                });
                $('#div-resultado').append(conteudo);
            }
        }
    });
});