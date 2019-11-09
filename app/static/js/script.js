$('#btn-prosseguir').click(function(e) {
    e.preventDefault();

    let qtd_variaveis_decisao = parseInt($('#txt-variaveis-decisao').val());
    let qtd_restricoes = parseInt($('#txt-restricoes').val());

    if (qtd_variaveis_decisao > 0 && qtd_restricoes > 0) {        
        let funcao = criar_html(1, qtd_variaveis_decisao);
        $('#div-funcao').append(funcao);

        let restricoes = criar_html(qtd_restricoes, qtd_variaveis_decisao);
        $('#div-restricoes').append(restricoes);

        $('#div-primeira-etapa').hide(500);
        $('#div-segunda-etapa').show(500);        
    } else {
        alert('N');
    }
});

function criar_html(qtd_forms, qtd_campos) {
    var conteudo = '';
    for (i=0; i<qtd_forms; i++) {        
        conteudo += '<form class="form-inline">';
        for (h=0; h<qtd_campos; h++) {
            conteudo += '<div class="form-group mb-2">';
            conteudo += '<input type="text" class="form-control-plaintext">';
            conteudo += '<span class="badge badge-dark">X1</span>';
            conteudo += '</div>';
        }
        if (qtd_forms > 1) { // restricoes
            conteudo += '<select class="form-control" id="exampleFormControlSelect1">';
            conteudo += '<option><=</option>';
            conteudo += '<option>>=</option>';
            conteudo += '</select>';
            conteudo += '<div class="form-group mb-2">';
            conteudo += '<input type="text" class="form-control-plaintext">';
            conteudo += '</div>';
        }        
        conteudo += '</form>'; 
    }
    return conteudo;
}

$('#btn-voltar').click(function(e) {
    e.preventDefault();

    $('#div-primeira-etapa').show(500);
    $('#div-segunda-etapa').hide(500);
});

$('#btn-calcular').click(function(e) {
    e.preventDefault();

    alert('Em desenvolvimento');
});