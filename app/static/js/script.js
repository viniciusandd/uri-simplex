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

function preparar_funcao() {    
    var qtd_variaveis_decisao = $('#txt-qtd-variaveis-decisao').val();
    var campos = $('.txt-funcao');
    console.log(campos);
    var linha_z = 'Z'
    for (var i=0; i<qtd_variaveis_decisao; i++) {
        console.log(campos[i].value);
        linha_z += ' - ' + campos[i].value + 'x' + (i + 1);
    }
    linha_z += ' = 0 <br>';    

    var outras_linhas = '';
    var qtd_restricoes = $('#txt-qtd-restricoes').val();
    for (var i=1; i<=qtd_restricoes; i++) {
        var restricoes = $('.txt-restricao' + i);        
        for (var h=0; h<qtd_variaveis_decisao; h++) {            
            if (h == qtd_variaveis_decisao - 1) {
                outras_linhas += restricoes[h].value + 'x' + (h + 1) + ' + xF' + i + ' = ' + $('#txt-valor-independente'+i).val() + '<br>';
            } else {
                outras_linhas += restricoes[h].value + 'x' + (h + 1) + ' + ';
            }
        }
    }    
    $('#div-funcao-pronta').append(
        '<p>' + linha_z + outras_linhas + '</p>'
    );
}

function criar_json() {
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
}

$('#btn-voltar-segunda-etapa').click(function(e) {
    e.preventDefault();
    $('#div-funcao-pronta').html('');
    $('#div-terceira-etapa').hide(500);
    $('#div-segunda-etapa').show(500);
});

$('#btn-calcular').click(function(e) {
    e.preventDefault();
    alert('em desenv');
});