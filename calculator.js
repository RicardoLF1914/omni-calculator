let expressao = '0';
let numeroAtual = '0';
let novoNumero = false;
let historico = [];

const operadores = {
    'adicao': '+',
    'subtracao': '−',
    'multiplicacao': '×',
    'divisao': '÷',
    'potenciacao': '^',
    'radiciacao': '√'
};

const operacoesCientificas = {
    'seno': 'sin',
    'cosseno': 'cos',
    'tangente': 'tan',
    'logaritmo': 'log',
    'logN': 'ln',
    'absoluto': 'abs'
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
    const ultimoParenIndex = expressao.lastIndexOf('(');
    const ultimoOpIndex = Math.max(
        expressao.lastIndexOf('+'),
        expressao.lastIndexOf('−'),
        expressao.lastIndexOf('×'),
        expressao.lastIndexOf('÷'),
        expressao.lastIndexOf('^')
    );
    
    const ultimaAcaoIndex = Math.max(ultimoParenIndex, ultimoOpIndex);
    
    if (ultimaAcaoIndex !== -1) {
        expressao = expressao.substring(0, ultimaAcaoIndex + 1) + numeroAtual;
    } else {
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

function adicionarParentese(tipo) {
    if (tipo === '(') {
        // Abre parêntese
        if (/[0-9.]$/.test(expressao)) {
            // Se termina com número, adiciona multiplicação implícita
            expressao += '×(';
        } else {
            expressao += '(';
        }
        numeroAtual = '0';
        novoNumero = true;
    } else {
        // Fecha parêntese
        if (/[+−×÷^(]$/.test(expressao)) {
            // Não permite `)` logo após operador ou `(`
            return;
        }
        expressao += ')';
        novoNumero = true;
    }
    atualizarDisplay();
}

function adicionarNumeroNegativo() {
    // Verifica se é apropriado adicionar um sinal negativo
    if (/[+−×÷^(]$/.test(expressao) || expressao === '0') {
        // É sinal negativo
        numeroAtual = '-';
        expressao = /[+−×÷^(]$/.test(expressao) ? expressao + '-' : '-';
        novoNumero = false;
    } else {
        // É operador de subtração
        adicionarOperacao('subtracao');
    }
    atualizarDisplay();
}

function avaliarExpressao(expr) {
    try {
        // Primeira, processa as funções científicas
        let exprProcessada = expr;
        
        // Processa sin, cos, tan
        exprProcessada = exprProcessada.replace(/sin\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            return isNaN(n) ? 0 : Math.sin(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/cos\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            return isNaN(n) ? 0 : Math.cos(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/tan\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            if (isNaN(n)) return 0;
            if (n % 180 === 90) {
                alert("Tangente indefinida para esse ângulo!");
                return NaN;
            }
            return Math.tan(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/log\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            if (isNaN(n)) return 0;
            if (n <= 0) {
                alert("Logaritmo indefinido para valores ≤ 0!");
                return NaN;
            }
            return Math.log10(n);
        });
        
        exprProcessada = exprProcessada.replace(/ln\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            if (isNaN(n)) return 0;
            if (n <= 0) {
                alert("Logaritmo natural indefinido para valores ≤ 0!");
                return NaN;
            }
            return Math.log(n);
        });
        
        exprProcessada = exprProcessada.replace(/abs\(([^)]+)\)/g, function(match, p1) {
            const n = parseFloat(p1);
            return isNaN(n) ? 0 : Math.abs(n);
        });
        
        // Agora converte para operações matemáticas padrão
        let exprFinal = exprProcessada
            .replace(/−/g, '-')
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/√/g, 'Math.sqrt');
        
        // Avalia a expressão
        const resultado = eval(exprFinal);
        return resultado;
    } catch (e) {
        return null;
    }
}

function calcular() {
    const expressaoAntes = expressao;
    const resultado = avaliarExpressao(expressao);

    if (resultado === null || isNaN(resultado)) {
        alert("Expressão inválida!");
        return;
    }

    const resultadoFinal = parseFloat(resultado.toFixed(10));

    // Registra no histórico
    historico.push(`${expressaoAntes} = ${resultadoFinal}`);

    expressao = resultadoFinal.toString();
    numeroAtual = expressao;
    novoNumero = true;
    atualizarDisplay();
}

function adicionarOperacaoCientifica(op) {
    // Aplica a função ao número atual e envolve em parênteses
    if (!novoNumero) {
        // Estava digitando um número, aplica a função a ele
        numeroAtual = operacoesCientificas[op] + '(' + numeroAtual + ')';
        expressao = numeroAtual;
    } else if (/[+−×÷^(]$/.test(expressao) || expressao === '0') {
        // Expressão termina com operador ou está vazia, aplica função ao 0
        numeroAtual = operacoesCientificas[op] + '(0)';
        expressao = /[+−×÷^(]$/.test(expressao) ? expressao + numeroAtual : numeroAtual;
    } else {
        // Substitui a expressão inteira com a função aplicada
        numeroAtual = operacoesCientificas[op] + '(' + expressao + ')';
        expressao = numeroAtual;
    }
    
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
    if (expressao === '0' || expressao === '-' || expressao === '') {
        // Não apaga se é o valor inicial
        return;
    }
    
    // Remove o último caractere
    expressao = expressao.slice(0, -1);
    
    if (expressao === '' || expressao === '-') {
        expressao = '0';
        numeroAtual = '0';
        novoNumero = false;
    } else {
        // Atualiza numeroAtual baseado no novo estado da expressão
        const ultimoParenIndex = expressao.lastIndexOf('(');
        const ultimoOpIndex = Math.max(
            expressao.lastIndexOf('+'),
            expressao.lastIndexOf('−'),
            expressao.lastIndexOf('×'),
            expressao.lastIndexOf('÷'),
            expressao.lastIndexOf('^')
        );
        
        const ultimaAcaoIndex = Math.max(ultimoParenIndex, ultimoOpIndex);
        
        if (ultimaAcaoIndex !== -1) {
            numeroAtual = expressao.substring(ultimaAcaoIndex + 1);
        } else {
            numeroAtual = expressao;
        }
        
        // Se termina com operador ou parêntese, está pronto para novo número
        if (/[+−×÷^(]$/.test(expressao)) {
            novoNumero = true;
        } else {
            novoNumero = false;
        }
    }
    
    atualizarDisplay();
}

// Event listeners para botões de operação
document.querySelectorAll('.operacao').forEach(btn => {
    btn.addEventListener('click', function() {
        adicionarOperacao(this.dataset.operacao);
    });
});

// Event listeners para botões de operações científicas
document.querySelectorAll('.operacao-cientifica').forEach(btn => {
    btn.addEventListener('click', function() {
        adicionarOperacaoCientifica(this.dataset.operacao);
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
        adicionarNumeroNegativo();
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
    // Parênteses
    else if (key === '(') {
        adicionarParentese('(');
    }
    else if (key === ')') {
        adicionarParentese(')');
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

// Event listeners do modal de histórico
const modal = document.getElementById('modal-historico');
const listaHistorico = document.getElementById('lista-historico');

document.getElementById('btn-historico').addEventListener('click', function () {
    listaHistorico.innerHTML = '';

    if (historico.length === 0) {
        listaHistorico.innerHTML = '<li class="historico-vazio">Nenhuma operação realizada ainda.</li>';
    } else {
        historico.slice().reverse().forEach(entrada => {
            const li = document.createElement('li');
            li.textContent = entrada;
            listaHistorico.appendChild(li);
        });
    }

    modal.classList.add('aberto');
});

document.getElementById('fechar-modal').addEventListener('click', function () {
    modal.classList.remove('aberto');
});

document.getElementById('limpar-historico').addEventListener('click', function () {
    historico = [];
    listaHistorico.innerHTML = '<li class="historico-vazio">Nenhuma operação realizada ainda.</li>';
});

modal.addEventListener('click', function (e) {
    if (e.target === modal) modal.classList.remove('aberto');
});