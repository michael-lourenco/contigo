class CalculoData {
    constructor() {
        // Constructor
    }

    // Método de inicialização
    start() {}

    // Método de atualização
    update() {}

    // Método para formatar o resultado
    formatarResultado() {}

    /**
     * Função que contém todas as fórmulas utilizadas para resolver as questões com operações básicas e parênteses envolvendo 3 números
     * São 64 possibilidades base
     * Utiliza try{}catch{} para operações de divisão para evitar divisão por zero
     * Pode ser melhorada para ficar menor
     */
    formulas(a, b, c) {
        let resLista = [];

        // Adiciona os resultados das fórmulas na lista de resultados
        resLista.push({ valor: a + b + c, resultadoTexto: `${a} + ${b} + ${c}` });
        resLista.push({ valor: a + b - c, resultadoTexto: `${a} + ${b} - ${c}` });
        resLista.push({ valor: a + b * c, resultadoTexto: `${a} + ${b} * ${c}` });
        try {
            resLista.push({ valor: a + b / c, resultadoTexto: `${a} + ${b} / ${c}` });
        } catch (e) {}

        resLista.push({ valor: a - b - c, resultadoTexto: `${a} - ${b} - ${c}` });
        resLista.push({ valor: a - b + c, resultadoTexto: `${a} - ${b} + ${c}` });
        resLista.push({ valor: a - b * c, resultadoTexto: `${a} - ${b} * ${c}` });
        try {
            resLista.push({ valor: a - b / c, resultadoTexto: `${a} - ${b} / ${c}` });
        } catch (e) {}

        resLista.push({ valor: a * b * c, resultadoTexto: `${a} * ${b} * ${c}` });
        resLista.push({ valor: a * b + c, resultadoTexto: `${a} * ${b} + ${c}` });
        resLista.push({ valor: a * b - c, resultadoTexto: `${a} * ${b} - ${c}` });
        try {
            resLista.push({ valor: a * b / c, resultadoTexto: `${a} * ${b} / ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: a / b / c, resultadoTexto: `${a} / ${b} / ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: a / b + c, resultadoTexto: `${a} / ${b} + ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: a / b - c, resultadoTexto: `${a} / ${b} - ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: a / b * c, resultadoTexto: `${a} / ${b} * ${c}` });
        } catch (e) {}

        resLista.push({ valor: (a + b) + c, resultadoTexto: `(${a} + ${b}) + ${c}` });
        resLista.push({ valor: (a + b) - c, resultadoTexto: `(${a} + ${b}) - ${c}` });
        resLista.push({ valor: (a + b) * c, resultadoTexto: `(${a} + ${b}) * ${c}` });
        try {
            resLista.push({ valor: (a + b) / c, resultadoTexto: `(${a} + ${b}) / ${c}` });
        } catch (e) {}

        resLista.push({ valor: (a - b) - c, resultadoTexto: `(${a} - ${b}) - ${c}` });
        resLista.push({ valor: (a - b) + c, resultadoTexto: `(${a} - ${b}) + ${c}` });
        resLista.push({ valor: (a - b) * c, resultadoTexto: `(${a} - ${b}) * ${c}` });
        try {
            resLista.push({ valor: (a - b) / c, resultadoTexto: `(${a} - ${b}) / ${c}` });
        } catch (e) {}

        resLista.push({ valor: (a * b) * c, resultadoTexto: `(${a} * ${b}) * ${c}` });
        resLista.push({ valor: (a * b) + c, resultadoTexto: `(${a} * ${b}) + ${c}` });
        resLista.push({ valor: (a * b) - c, resultadoTexto: `(${a} * ${b}) - ${c}` });
        try {
            resLista.push({ valor: (a * b) / c, resultadoTexto: `(${a} * ${b}) / ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: (a / b) / c, resultadoTexto: `(${a} / ${b}) / ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: (a / b) + c, resultadoTexto: `(${a} / ${b}) + ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: (a / b) - c, resultadoTexto: `(${a} / ${b}) - ${c}` });
        } catch (e) {}

        try {
            resLista.push({ valor: (a / b) * c, resultadoTexto: `(${a} / ${b}) * ${c}` });
        } catch (e) {}

        resLista.push({ valor: a + (b + c), resultadoTexto: `${a} + (${b} + ${c})` });
        resLista.push({ valor: a - (b + c), resultadoTexto: `${a} - (${b} + ${c})` });
        resLista.push({ valor: a * (b + c), resultadoTexto: `${a} * (${b} + ${c})` });
        try {
            resLista.push({ valor: a / (b + c), resultadoTexto: `${a} / (${b} + ${c})` });
        } catch (e) {}

        resLista.push({ valor: a - (b - c), resultadoTexto: `${a} - (${b} - ${c})` });
        resLista.push({ valor: a + (b - c), resultadoTexto: `${a} + (${b} - ${c})` });
        resLista.push({ valor: a * (b - c), resultadoTexto: `${a} * (${b} - ${c})` });
        try {
            resLista.push({ valor: a / (b - c), resultadoTexto: `${a} / (${b} - ${c})` });
        } catch (e) {}

        resLista.push({ valor: a * (b * c), resultadoTexto: `${a} * (${b} * ${c})` });
        resLista.push({ valor: a + (b * c), resultadoTexto: `${a} + (${b} * ${c})` });
        resLista.push({ valor: a - (b * c), resultadoTexto: `${a} - (${b} * ${c})` });
        try {
            resLista.push({ valor: a / (b * c), resultadoTexto: `${a} / (${b} * ${c})` });
        } catch (e) {}

        try {
            resLista.push({ valor: a / (b / c), resultadoTexto: `${a} / (${b} / ${c})` });
        } catch (e) {}

        try {
            resLista.push({ valor: a + (b / c), resultadoTexto: `${a} + (${b} / ${c})` });
        } catch (e) {}

        try {
            resLista.push({ valor: a - (b / c), resultadoTexto: `${a} - (${b} / ${c})` });
        } catch (e) {}

        try {
            resLista.push({ valor: a * (b / c), resultadoTexto: `${a} * (${b} / ${c})` });
        } catch (e) {}

        return resLista;
    }

    /**
     * Função que utiliza a função formulas() para executar todas as 384 possibilidades de contas
     * alternando os valores a, b, c em três listas de ResultadoData
     * Retorna uma lista de ResultadoData
     */
    executaFormulas(a, b, c) {
        let resListaFinal = [];

        let resLista_1 = this.formulas(a, b, c);
        resListaFinal = resListaFinal.concat(resLista_1);

        let resLista_2 = this.formulas(a, c, b);
        resListaFinal = resListaFinal.concat(resLista_2);

        let resLista_3 = this.formulas(b, a, c);
        resListaFinal = resListaFinal.concat(resLista_3);

        let resLista_4 = this.formulas(b, c, a);
        resListaFinal = resListaFinal.concat(resLista_4);

        let resLista_5 = this.formulas(c, a, b);
        resListaFinal = resListaFinal.concat(resLista_5);

        let resLista_6 = this.formulas(c, b, a);
        resListaFinal = resListaFinal.concat(resLista_6);

        return resListaFinal;
    }

    /**
     * Função que executa as fórmulas e faz o filtro do valor que procuramos
     * Utiliza Set() para evitar duplicidades
     * O Set só funciona para dados primitivos, por isso precisa das variáveis
     * valoresSet e resListaSet
     */
    resolve(a, b, c, valorProc) {
        let resultado = {
            valorEncontrado: false,
            resultados: [],
            totalResultados: 0,
            totalPossibilidades: 0,
            valorEncontradoTexto: "",
        };

        let resListaFinal = this.executaFormulas(a, b, c);

        let valoresSet = new Set();
        let resListaSet = new Set();

        resListaFinal.forEach((item) => {
            if (item.valor === valorProc) {
                valoresSet.add(item.valor);
                resListaSet.add(item);
                resultado.valorEncontrado = true;
                resultado.valorEncontradoTexto = item.resultadoTexto;
            }
        });

        resultado.resultados = Array.from(resListaSet);
        resultado.totalResultados = resultado.resultados.length;
        resultado.totalPossibilidades = resListaFinal.length;

        return resultado;
    }
}

// Exemplo de uso
// const calculoData = new CalculoData();
// const resultado = calculoData.resolve(1, 2, 3, 5);
// console.log(resultado);
