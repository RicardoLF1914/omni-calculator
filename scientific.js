function calcular() {
    if (document.getElementById('n').value === "") {
        alert("Insira um valor!");
        return;
    }

    let n = Number(document.getElementById('n').value);
    let op = document.querySelector(".operacoes input[type='radio']:checked");
    let resultbox = document.querySelector(".resultado span");

    if (!op) {
        alert("Selecione uma operação!");
        return;
    }

    let resultado;

    switch (op.value) {
        case "seno":
            resultado = Math.sin(n * (Math.PI / 180));
            break;
        case "cosseno":
            resultado = Math.cos(n * (Math.PI / 180));
            break;
        case "tangente":
            if (n % 180 === 90) {
                alert("Tangente indefinida para esse ângulo!");
                return;
            }
            resultado = Math.tan(n * (Math.PI / 180));
            break;
        case "logaritmo":
            if (n <= 0) {
                alert("Logaritmo indefinido para valores menores ou iguais a zero!");
                return;
            }
            resultado = Math.log10(n);
            break;
        case "absoluto":
            resultado = Math.abs(n);
            break;
        case "logN":
            if (n <= 0) {
                alert("Logaritmo natural indefinido para valores menores ou iguais a zero!");
                return;
            }
            resultado = Math.log(n);
            break;
    }

    resultbox.innerHTML = parseFloat(resultado.toFixed(10));
}