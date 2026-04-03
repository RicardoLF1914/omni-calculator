let expressao = '0';
let numeroAtual = '0';
let novoNumero = false;

const operacoes = {
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
        expressao.lastIndexOf('÷')
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
    // Encontra a última operação aritmética e executa
    const ultimaOpMatch = expressao.match(/^(.+?)\s*([\+\−\×\÷])\s*(.+?)$/);
    
    if (!ultimaOpMatch) {
        // Não há operação aritmética, apenas uma função ou número
        return null;
    }
    
    let parte1 = ultimaOpMatch[1];
    let operador = ultimaOpMatch[2];
    let parte2 = ultimaOpMatch[3];
    
    let n1 = calcularFuncao(parte1);
    let n2 = calcularFuncao(parte2);
    let resultado;

    switch (operador) {
        case "+":
            resultado = n1 + n2;
            break;
        case "−":
            resultado = n1 - n2;
            break;
        case "×":
            resultado = n1 * n2;
            break;
        case "÷":
            if (n2 === 0) {
                alert("Divisão por zero!");
                limpar();
                return null;
            }
            resultado = n1 / n2;
            break;
    }
    
    resultado = parseFloat(resultado.toFixed(10));
    expressao = resultado.toString();
    numeroAtual = resultado.toString();
    novoNumero = true;
    return resultado;
}

function calcularFuncao(expr) {
    // Remove espaços
    expr = expr.trim();
    
    // Verifica e executa cada tipo de função
    if (expr.startsWith('sin(') && expr.endsWith(')')) {
        let n = Number(expr.slice(4, -1));
        return Math.sin(n * (Math.PI / 180));
    }
    if (expr.startsWith('cos(') && expr.endsWith(')')) {
        let n = Number(expr.slice(4, -1));
        return Math.cos(n * (Math.PI / 180));
    }
    if (expr.startsWith('tan(') && expr.endsWith(')')) {
        let n = Number(expr.slice(4, -1));
        if (n % 180 === 90) {
            alert("Tangente indefinida para esse ângulo!");
            limpar();
            return NaN;
        }
        return Math.tan(n * (Math.PI / 180));
    }
    if (expr.startsWith('log(') && expr.endsWith(')')) {
        let n = Number(expr.slice(4, -1));
        if (n <= 0) {
            alert("Logaritmo indefinido para valores menores ou iguais a zero!");
            limpar();
            return NaN;
        }
        return Math.log10(n);
    }
    if (expr.startsWith('ln(') && expr.endsWith(')')) {
        let n = Number(expr.slice(3, -1));
        if (n <= 0) {
            alert("Logaritmo natural indefinido para valores menores ou iguais a zero!");
            limpar();
            return NaN;
        }
        return Math.log(n);
    }
    if (expr.startsWith('abs(') && expr.endsWith(')')) {
        let n = Number(expr.slice(4, -1));
        return Math.abs(n);
    }
    
    // Se não há função, retorna como número
    return Number(expr);
}

function adicionarOperacaoCientifica(op) {
    // Aplica a função ao número atual e envolve em parênteses
    if (!novoNumero) {
        // Estava digitando um número, aplica a função a ele
        numeroAtual = operacoes[op] + '(' + numeroAtual + ')';
        expressao = numeroAtual;
    } else if (/[\+\−\×\÷]$/.test(expressao)) {
        // Expressão termina com operador, aplica função ao número 0 como padrão
        numeroAtual = operacoes[op] + '(0)';
        expressao += numeroAtual;
    } else {
        // Substitui a expressão inteira com a função aplicada
        numeroAtual = operacoes[op] + '(' + expressao + ')';
        expressao = numeroAtual;
    }
    
    novoNumero = true;
    atualizarDisplay();
}

function adicionarOperacaoAritmetica(operador) {
    // Se a expressão termina com um operador, não adiciona outro
    if (/[\+\−\×\÷]$/.test(expressao)) return;
    
    // Adiciona o operador à expressão
    expressao += operador;
    numeroAtual = '0';
    novoNumero = true;
    atualizarDisplay();
}

function adicionarParentese(tipo) {
    if (tipo === '(') {
        // Abre parêntese
        if (/[0-9.)]$/.test(expressao)) {
            // Se termina com número ou ), adiciona multiplicação implícita
            expressao += '×(';
        } else {
            expressao += '(';
        }
        numeroAtual = '0';
        novoNumero = true;
    } else {
        // Fecha parêntese
        if (/[\+\−\×\÷(]$/.test(expressao)) {
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
    if (/[\+\−\×\÷(]$/.test(expressao) || expressao === '0') {
        // É sinal negativo
        numeroAtual = '-';
        expressao = /[\+\−\×\÷(]$/.test(expressao) ? expressao + '-' : '-';
        novoNumero = false;
    } else {
        // É operador de subtração
        adicionarOperacaoAritmetica('−');
    }
    atualizarDisplay();
}

function calcular() {
    try {
        const resultado = avaliarExpressaoCompleta(expressao);
        
        if (resultado === null || isNaN(resultado)) {
            alert("Expressão inválida!");
            return;
        }
        
        expressao = parseFloat(resultado.toFixed(10)).toString();
        numeroAtual = expressao;
        novoNumero = true;
        atualizarDisplay();
    } catch (e) {
        alert("Erro ao calcular!");
    }
}

function avaliarExpressaoCompleta(expr) {
    try {
        // Primeira, processa as funções científicas
        let exprProcessada = expr;
        
        // Processa sin, cos, tan
        exprProcessada = exprProcessada.replace(/sin\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            return Math.sin(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/cos\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            return Math.cos(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/tan\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            if (n % 180 === 90) {
                alert("Tangente indefinida para esse ângulo!");
                return NaN;
            }
            return Math.tan(n * (Math.PI / 180));
        });
        
        exprProcessada = exprProcessada.replace(/log\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            if (n <= 0) {
                alert("Logaritmo indefinido para valores ≤ 0!");
                return NaN;
            }
            return Math.log10(n);
        });
        
        exprProcessada = exprProcessada.replace(/ln\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            if (n <= 0) {
                alert("Logaritmo natural indefinido para valores ≤ 0!");
                return NaN;
            }
            return Math.log(n);
        });
        
        exprProcessada = exprProcessada.replace(/abs\(([^)]+)\)/g, function(match, p1) {
            const n = avaliarExpressaoCompleta(p1);
            return Math.abs(n);
        });
        
        // Agora converte para operações matemáticas padrão
        let exprFinal = exprProcessada
            .replace(/−/g, '-')
            .replace(/×/g, '*')
            .replace(/÷/g, '/');
        
        // Avalia a expressão
        const resultado = eval(exprFinal);
        return resultado;
    } catch (e) {
        return null;
    }
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
            expressao.lastIndexOf('÷')
        );
        
        const ultimaAcaoIndex = Math.max(ultimoParenIndex, ultimoOpIndex);
        
        if (ultimaAcaoIndex !== -1) {
            numeroAtual = expressao.substring(ultimaAcaoIndex + 1);
        } else {
            numeroAtual = expressao;
        }
        
        // Se termina com operador ou parêntese, está pronto para novo número
        if (/[\+\−\×\÷(]$/.test(expressao)) {
            novoNumero = true;
        } else {
            novoNumero = false;
        }
    }
    
    atualizarDisplay();
}

// Event listeners para botões de operações científicas
document.querySelectorAll('.operacao').forEach(btn => {
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
    // Operações aritméticas
    else if (key === '+') {
        adicionarOperacaoAritmetica('+');
    }
    else if (key === '-') {
        adicionarNumeroNegativo();
    }
    else if (key === '*') {
        adicionarOperacaoAritmetica('×');
    }
    else if (key === '/') {
        event.preventDefault();
        adicionarOperacaoAritmetica('÷');
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