let expressao = '0';
let numeroAtual = '0';
let novoNumero = false;

const operadores = {
    'adicao': '+',
    'subtracao': '−',
    'multiplicacao': '×',
    'divisao': '÷',
    'potenciacao': '^',
    'radiciacao': '√'
};

function atualizarDisplay() {
    document.getElementById('display').innerHTML = expressao;
}

function adicionarDigito(digito) {
    if (novoNumero) {
        numeroAtual = digito === '.' ? '0.' : digito;
        novoNumero = false;
    } else {
        if (digito === '.') {
            if (!numeroAtual.includes('.')) {
                numeroAtual += digito;
            }
        } else {
            if (numeroAtual === '0') {
                numeroAtual = digito;
            } else {
                numeroAtual += digito;
            }
        }
    }
    
    // Atualizar expressão com o novo número
    // Se há um operador na expressão, mantém tudo e apenas atualiza o número após o último operador
    const ultimoOpIndex = expressao.search(/[+−×÷^](?=[^+−×÷^]*$)/);
    
    if (ultimoOpIndex !== -1) {
        // Há um operador, então substituir apenas o número após o operador
        expressao = expressao.substring(0, ultimoOpIndex + 1) + numeroAtual;
    } else {
        // Sem operador, é só o número atual
        expressao = numeroAtual;
    }
    atualizarDisplay();
}

function executarOperacao() {
    const ultimaOpMatch = expressao.match(/([0-9.]+)\s*([+−×÷^])\s*([0-9.]+)$/);
    
    if (!ultimaOpMatch) return null;
    
    let n1 = Number(ultimaOpMatch[1]);
    let operadorSimb = ultimaOpMatch[2];
    let n2 = Number(ultimaOpMatch[3]);
    let resultado;
    
    // Mapear símbolo para operação
    let op;
    for (let key in operadores) {
        if (operadores[key] === operadorSimb) {
            op = key;
            break;
        }
    }

    switch (op) {
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
                limpar();
                return null;
            }
            resultado = n1 / n2;
            break;
        case "potenciacao":
            resultado = Math.pow(n1, n2);
            break;
        case "radiciacao":
            if (n1 < 0) {
                alert("Raiz de número negativo!");
                limpar();
                return null;
            }
            if (n2 === 0) {
                alert("Índice da raiz não pode ser zero!");
                limpar();
                return null;
            }
            resultado = Math.pow(n1, 1 / n2);
            break;
    }
    
    resultado = parseFloat(resultado.toFixed(10));
    // Substitui a operação anterior pelo resultado na expressão
    expressao = expressao.substring(0, ultimaOpMatch.index) + resultado;
    numeroAtual = resultado.toString();
    novoNumero = true;
    return resultado;
}

function adicionarOperacao(operacao) {
    // Se a expressão termina com um operador, não adiciona outro
    if (/[+−×÷^]$/.test(expressao)) return;
    
    // Simplesmente adiciona o operador à expressão
    expressao += operadores[operacao];
    
    numeroAtual = '0';
    novoNumero = true;
    atualizarDisplay();
}

function calcular() {
    while (/[+−×÷^]/.test(expressao)) {
        const resultado = executarOperacao();
        if (resultado === null) return;
    }
    numeroAtual = expressao;
    novoNumero = true;
    atualizarDisplay();
}

function limpar() {
    expressao = '0';
    numeroAtual = '0';
    novoNumero = false;
    atualizarDisplay();
}

function apagarUltimo() {
    if (!novoNumero && /[0-9.]+$/.test(expressao)) {
        // Se estamos digitando número, apaga o último dígito
        numeroAtual = numeroAtual.slice(0, -1) || '0';
        
        // Se há operador na expressão, mantém tudo até o operador e atualiza número
        const lastOpIndex = expressao.search(/[+−×÷^](?=[0-9.]+$)/);
        if (lastOpIndex !== -1) {
            expressao = expressao.substring(0, lastOpIndex + 1) + numeroAtual;
        } else {
            expressao = numeroAtual;
        }
    } else if (/[+−×÷^]$/.test(expressao)) {
        // Se o último caractere é um operador, remove
        expressao = expressao.slice(0, -1);
        numeroAtual = '0';
        novoNumero = false;
    }
    atualizarDisplay();
}

// Event listeners para botões de operação
document.querySelectorAll('.operacao').forEach(btn => {
    btn.addEventListener('click', function() {
        adicionarOperacao(this.dataset.operacao);
    });
});

// Event listeners para botões especiais
document.getElementById('calcular').addEventListener('click', calcular);
document.getElementById('limpar').addEventListener('click', limpar);

// Event listener para teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Números (0-9)
    if (/^[0-9]$/.test(key)) {
        adicionarDigito(key);
    }
    // Ponto decimal
    else if (key === '.') {
        adicionarDigito('.');
    }
    // Operações
    else if (key === '+') {
        adicionarOperacao('adicao');
    }
    else if (key === '-') {
        adicionarOperacao('subtracao');
    }
    else if (key === '*') {
        adicionarOperacao('multiplicacao');
    }
    else if (key === '/') {
        event.preventDefault();
        adicionarOperacao('divisao');
    }
    else if (key === '^') {
        adicionarOperacao('potenciacao');
    }
    // Enter para calcular
    else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calcular();
    }
    // Backspace para apagar
    else if (key === 'Backspace') {
        event.preventDefault();
        apagarUltimo();
    }
    // C ou Escape para limpar
    else if (key.toLowerCase() === 'c' || key === 'Escape') {
        limpar();
    }
});