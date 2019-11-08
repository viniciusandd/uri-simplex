$('#btn-prosseguir').click(function(e) {
    e.preventDefault();

    let qtd_variaveis_decisao = parseInt($('#txt-variaveis-decisao').val());
    let qtd_restricoes = parseInt($('#txt-restricoes').val());

    if (qtd_variaveis_decisao > 0 && qtd_restricoes > 0) {        
        let campos = criar_html(qtd_variaveis_decisao, 1); 
        $('#div-funcao').append(conteudo);

        $('#div-primeira-etapa').hide(500);
        $('#div-segunda-etapa').show(500);        
    } else {
        alert('N');
    }
});

function criar_html(qtd_variaveis_decisao, qtd_restricoes) {
    var conteudo = '';
    for (i=0; i<qtd; i++) {
        conteudo = '<label>Qual sua função?</label>';
        conteudo += '<form class="form-inline">';
        conteudo += '<div class="form-group mb-2">';
        conteudo += '<input type="text" class="form-control-plaintext">';
        conteudo += '<span class="badge badge-dark">X1</span>';
        conteudo += '</div>';

        for (i=0; i<qtd; i++) {
            conteudo += '<div class="form-group mb-2">';
            conteudo += '<input type="text" class="form-control-plaintext">';
            conteudo += '<span class="badge badge-dark">X1</span>';
            conteudo += '</div>';
        }
        conteudo += '</form>'; 
    }  
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