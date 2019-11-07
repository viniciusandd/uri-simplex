$('#btn-prosseguir').click(function(e) {
    e.preventDefault();

    $('#primeira-etapa').hide(500);
    $('#segunda-etapa').show(500);
});

$('#btn-voltar').click(function(e) {
    e.preventDefault();

    $('#primeira-etapa').show(500);
    $('#segunda-etapa').hide(500);
});

$('#btn-calcular').click(function(e) {
    e.preventDefault();

    alert('Em desenvolvimento');
});