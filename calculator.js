function calcular () {
    if (document.getElementById('n1').value === "" || document.getElementById('n2').value === "") {
        alert("Insira os dois valores!");
        return;
    }

    let n1 = Number(document.getElementById('n1').value)
    let n2 = Number(document.getElementById('n2').value)
    let op = document.querySelector(".operacoes input[name='operacao']:checked");
    let resultbox = document.querySelector(".resultado span");

    if (!op) {
        alert("Selecione uma operação!");
        return;
    }

    let resultado;

    switch (op.value) {
        case "adicao":
            resultado = n1 + n2;
            break;
        case "subtracao":
            resultado = n1 - n2;
            break;
        case "multiplicacao":
            resultado = n1 * n2;
            break;
        case "divisao":
            if (n2 === 0) {
                alert("Divisão por zero!");
                return;
            }
            resultado = n1 / n2;
            break;
        case "potenciacao":
            resultado = Math.pow(n1, n2);
            break;
        case "radiciacao":
            if (n1 < 0) {
                alert("Raiz de número negativo!");
                return;
            }
            if (n2 === 0) {
                alert("Índice da raiz não pode ser zero!");
                return;
            }
            resultado = Math.pow(n1, 1 / n2);
            break;
    }

    resultbox.innerHTML = parseFloat(resultado.toFixed(10));
}