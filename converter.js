const unidades = {
    comprimento: [
        { label: "Milímetro (mm)", value: "mm", fator: 0.001 },
        { label: "Centímetro (cm)", value: "cm", fator: 0.01 },
        { label: "Metro (m)", value: "m", fator: 1 },
        { label: "Quilômetro (km)", value: "km", fator: 1000 },
        { label: "Polegada (in)", value: "in", fator: 0.0254 },
        { label: "Pé (ft)", value: "ft", fator: 0.3048 },
        { label: "Milha (mi)", value: "mi", fator: 1609.344 },
    ],
    massa: [
        { label: "Miligrama (mg)", value: "mg", fator: 0.000001 },
        { label: "Grama (g)", value: "g", fator: 0.001 },
        { label: "Quilograma (kg)", value: "kg", fator: 1 },
        { label: "Tonelada (t)", value: "t", fator: 1000 },
        { label: "Onça (oz)", value: "oz", fator: 0.0283495 },
        { label: "Libra (lb)", value: "lb", fator: 0.453592 },
    ],
    temperatura: [
        { label: "Celsius (°C)", value: "c" },
        { label: "Fahrenheit (°F)", value: "f" },
        { label: "Kelvin (K)", value: "k" },
    ],
    area: [
        { label: "Milímetro² (mm²)", value: "mm2", fator: 0.000001 },
        { label: "Centímetro² (cm²)", value: "cm2", fator: 0.0001 },
        { label: "Metro² (m²)", value: "m2", fator: 1 },
        { label: "Quilômetro² (km²)", value: "km2", fator: 1000000 },
        { label: "Hectare (ha)", value: "ha", fator: 10000 },
        { label: "Acre", value: "acre", fator: 4046.856 },
    ],
    volume: [
        { label: "Mililitro (mL)", value: "ml", fator: 0.001 },
        { label: "Litro (L)", value: "l", fator: 1 },
        { label: "Metro³ (m³)", value: "m3", fator: 1000 },
        { label: "Colher de chá (tsp)", value: "tsp", fator: 0.00492892 },
        { label: "Colher de sopa (tbsp)", value: "tbsp", fator: 0.0147868 },
        { label: "Xícara (cup)", value: "cup", fator: 0.236588 },
        { label: "Galão EUA (gal)", value: "gal", fator: 3.78541 },
    ],
    velocidade: [
        { label: "m/s", value: "ms", fator: 1 },
        { label: "km/h", value: "kmh", fator: 0.277778 },
        { label: "mph", value: "mph", fator: 0.44704 },
        { label: "Nó (kn)", value: "kn", fator: 0.514444 },
    ],
    tempo: [
        { label: "Milissegundo (ms)", value: "ms", fator: 0.001 },
        { label: "Segundo (s)", value: "s", fator: 1 },
        { label: "Minuto (min)", value: "min", fator: 60 },
        { label: "Hora (h)", value: "h", fator: 3600 },
        { label: "Dia (d)", value: "d", fator: 86400 },
        { label: "Semana", value: "sem", fator: 604800 },
        { label: "Mês (30d)", value: "mes", fator: 2592000 },
        { label: "Ano (365d)", value: "ano", fator: 31536000 },
    ],
};

function atualizarUnidades() {
    const categoria = document.getElementById("categoria").value;
    const lista = unidades[categoria];
    const selectDe = document.getElementById("de");
    const selectPara = document.getElementById("para");

    selectDe.innerHTML = "";
    selectPara.innerHTML = "";

    lista.forEach((u) => {
        selectDe.add(new Option(u.label, u.value));
        selectPara.add(new Option(u.label, u.value));
    });

    if (selectPara.options.length > 1) selectPara.selectedIndex = 1;

    document.querySelector(".resultado span").textContent = "-";
}

function swap() {
    const de = document.getElementById("de");
    const para = document.getElementById("para");
    const tempIndex = de.selectedIndex;
    de.selectedIndex = para.selectedIndex;
    para.selectedIndex = tempIndex;
}

function converter() {
    const categoria = document.getElementById("categoria").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const deVal = document.getElementById("de").value;
    const paraVal = document.getElementById("para").value;
    const span = document.querySelector(".resultado span");

    if (isNaN(valor)) {
        span.textContent = "Insira um valor válido";
        return;
    }

    let resultado;

    if (categoria === "temperatura") {
        resultado = converterTemperatura(valor, deVal, paraVal);
    } else {
        const lista = unidades[categoria];
        const fatorDe = lista.find(u => u.value === deVal).fator;
        const fatorPara = lista.find(u => u.value === paraVal).fator;
        resultado = (valor * fatorDe) / fatorPara;
    }

    const formatado = parseFloat(resultado.toPrecision(10)).toString();
    const unidadePara = unidades[categoria].find(u => u.value === paraVal).label;
    span.textContent = `${formatado} ${unidadePara.split(" ")[0]}`;
}

function converterTemperatura(valor, de, para) {
    let celsius;
    if (de === "c") celsius = valor;
    else if (de === "f") celsius = (valor - 32) * 5 / 9;
    else if (de === "k") celsius = valor - 273.15;

    if (para === "c") return celsius;
    if (para === "f") return celsius * 9 / 5 + 32;
    if (para === "k") return celsius + 273.15;
}

atualizarUnidades();