type ResultData = {
    value: number;
    resultText: string;
};

type Result = {
    valueFound: boolean;
    results: ResultData[];
    totalResults: number;
    totalPossibilities: number;
    valueFoundText: string;
};

class CalculateService {
    constructor() {
        // Constructor
    }
    /**
     * Função que contém todas as fórmulas utilizadas para resolver as questões com operações básicas e parênteses envolvendo 3 números
     * São 64 possibilidades base
     * Utiliza try{}catch{} para operações de divisão para evitar divisão por zero
     * Pode ser melhorada para ficar menor
     */
    private formulas(a: number, b: number, c: number): ResultData[] {
        const resList: ResultData[] = [];

        // Adiciona os results das fórmulas na lista de results
        resList.push({ value: a + b + c, resultText: `${a} + ${b} + ${c}` });
        resList.push({ value: a + b - c, resultText: `${a} + ${b} - ${c}` });
        resList.push({ value: a + b * c, resultText: `${a} + ${b} * ${c}` });
        try {
            resList.push({ value: a + b / c, resultText: `${a} + ${b} / ${c}` });
        } catch (e) {}

        resList.push({ value: a - b - c, resultText: `${a} - ${b} - ${c}` });
        resList.push({ value: a - b + c, resultText: `${a} - ${b} + ${c}` });
        resList.push({ value: a - b * c, resultText: `${a} - ${b} * ${c}` });
        try {
            resList.push({ value: a - b / c, resultText: `${a} - ${b} / ${c}` });
        } catch (e) {}

        resList.push({ value: a * b * c, resultText: `${a} * ${b} * ${c}` });
        resList.push({ value: a * b + c, resultText: `${a} * ${b} + ${c}` });
        resList.push({ value: a * b - c, resultText: `${a} * ${b} - ${c}` });
        try {
            resList.push({ value: a * b / c, resultText: `${a} * ${b} / ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: a / b / c, resultText: `${a} / ${b} / ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: a / b + c, resultText: `${a} / ${b} + ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: a / b - c, resultText: `${a} / ${b} - ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: a / b * c, resultText: `${a} / ${b} * ${c}` });
        } catch (e) {}

        resList.push({ value: (a + b) + c, resultText: `(${a} + ${b}) + ${c}` });
        resList.push({ value: (a + b) - c, resultText: `(${a} + ${b}) - ${c}` });
        resList.push({ value: (a + b) * c, resultText: `(${a} + ${b}) * ${c}` });
        try {
            resList.push({ value: (a + b) / c, resultText: `(${a} + ${b}) / ${c}` });
        } catch (e) {}

        resList.push({ value: (a - b) - c, resultText: `(${a} - ${b}) - ${c}` });
        resList.push({ value: (a - b) + c, resultText: `(${a} - ${b}) + ${c}` });
        resList.push({ value: (a - b) * c, resultText: `(${a} - ${b}) * ${c}` });
        try {
            resList.push({ value: (a - b) / c, resultText: `(${a} - ${b}) / ${c}` });
        } catch (e) {}

        resList.push({ value: (a * b) * c, resultText: `(${a} * ${b}) * ${c}` });
        resList.push({ value: (a * b) + c, resultText: `(${a} * ${b}) + ${c}` });
        resList.push({ value: (a * b) - c, resultText: `(${a} * ${b}) - ${c}` });
        try {
            resList.push({ value: (a * b) / c, resultText: `(${a} * ${b}) / ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: (a / b) / c, resultText: `(${a} / ${b}) / ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: (a / b) + c, resultText: `(${a} / ${b}) + ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: (a / b) - c, resultText: `(${a} / ${b}) - ${c}` });
        } catch (e) {}

        try {
            resList.push({ value: (a / b) * c, resultText: `(${a} / ${b}) * ${c}` });
        } catch (e) {}

        resList.push({ value: a + (b + c), resultText: `${a} + (${b} + ${c})` });
        resList.push({ value: a - (b + c), resultText: `${a} - (${b} + ${c})` });
        resList.push({ value: a * (b + c), resultText: `${a} * (${b} + ${c})` });
        try {
            resList.push({ value: a / (b + c), resultText: `${a} / (${b} + ${c})` });
        } catch (e) {}

        resList.push({ value: a - (b - c), resultText: `${a} - (${b} - ${c})` });
        resList.push({ value: a + (b - c), resultText: `${a} + (${b} - ${c})` });
        resList.push({ value: a * (b - c), resultText: `${a} * (${b} - ${c})` });
        try {
            resList.push({ value: a / (b - c), resultText: `${a} / (${b} - ${c})` });
        } catch (e) {}

        resList.push({ value: a * (b * c), resultText: `${a} * (${b} * ${c})` });
        resList.push({ value: a + (b * c), resultText: `${a} + (${b} * ${c})` });
        resList.push({ value: a - (b * c), resultText: `${a} - (${b} * ${c})` });
        try {
            resList.push({ value: a / (b * c), resultText: `${a} / (${b} * ${c})` });
        } catch (e) {}

        try {
            resList.push({ value: a / (b / c), resultText: `${a} / (${b} / ${c})` });
        } catch (e) {}

        try {
            resList.push({ value: a + (b / c), resultText: `${a} + (${b} / ${c})` });
        } catch (e) {}

        try {
            resList.push({ value: a - (b / c), resultText: `${a} - (${b} / ${c})` });
        } catch (e) {}

        try {
            resList.push({ value: a * (b / c), resultText: `${a} * (${b} / ${c})` });
        } catch (e) {}

        return resList;
    }

    /**
     * Função que utiliza a função formulas() para executar todas as 384 possibilidades de contas
     * alternando os valuees a, b, c em três listas de ResultData
     * Retorna uma lista de ResultData
     */
    private executesFormulas(a: number, b: number, c: number): ResultData[] {
        let resFinalList: ResultData[] = [];

        let resList_1 = this.formulas(a, b, c);
        resFinalList = resFinalList.concat(resList_1);

        let resList_2 = this.formulas(a, c, b);
        resFinalList = resFinalList.concat(resList_2);

        let resList_3 = this.formulas(b, a, c);
        resFinalList = resFinalList.concat(resList_3);

        let resList_4 = this.formulas(b, c, a);
        resFinalList = resFinalList.concat(resList_4);

        let resList_5 = this.formulas(c, a, b);
        resFinalList = resFinalList.concat(resList_5);

        let resList_6 = this.formulas(c, b, a);
        resFinalList = resFinalList.concat(resList_6);

        return resFinalList;
    }

    /**
     * Função que executa as fórmulas e faz o filtro do value que procuramos
     * Utiliza Set() para evitar duplicidades
     * O Set só funciona para dados primitivos, por isso precisa das variáveis
     * setValues e resListSet
     */
    public resolve(a: number, b: number, c: number, wantedValue: number): Result {
        const result: Result = {
            valueFound: false,
            results: [],
            totalResults: 0,
            totalPossibilities: 0,
            valueFoundText: "",
        };

        let resFinalList = this.executesFormulas(a, b, c);

        const setValues = new Set<number>();
        const resListSet = new Set<ResultData>();

        resFinalList.forEach((item) => {
            if (item.value === wantedValue) {
                setValues.add(item.value);
                resListSet.add(item);
                result.valueFound = true;
                result.valueFoundText = item.resultText;
            }
        });

        result.results = Array.from(resListSet);
        result.totalResults = result.results.length;
        result.totalPossibilities = resFinalList.length;

        return result;
    }
}

export const calculateService = new CalculateService();
