class RecintosZoo {

    static recintos = [
        { numero: 1, bioma: 'savana', tamanho: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3, tamanho: 1 }] },
        { numero: 2, bioma: 'floresta', tamanho: 5, animaisExistentes: [] },
        { numero: 3, bioma: 'savana e rio', tamanho: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1, tamanho: 2 }] },
        { numero: 4, bioma: 'rio', tamanho: 8, animaisExistentes: [] },
        { numero: 5, bioma: 'savana', tamanho: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1, tamanho: 3 }] }
    ];

    static animais = {
        LEAO: { tamanho: 3, biomas: ['savana'], carnivoro: true },
        LEOPARDO: { tamanho: 2, biomas: ['savana'], carnivoro: true },
        CROCODILO: { tamanho: 3, biomas: ['rio'], carnivoro: true },
        MACACO: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
        GAZELA: { tamanho: 2, biomas: ['savana'], carnivoro: false },
        HIPOPOTAMO: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
    };

    // Método que será chamado (modularizar depois)
    analisaRecintos(animal, quantidade) {

        // Verificação de entradas válidas
        if (!RecintosZoo.animais[animal]) {
            return { erro: 'Animal inválido' };
        }
        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        let infoAnimal = RecintosZoo.animais[animal];
        let tamanhoTotalAnimais = infoAnimal.tamanho * quantidade;
        let recintosViaveis = []

        // dessa forma, adiciona os recintos na ordem correta
        RecintosZoo.recintos.forEach(recinto => {
            // verifica cada bioma para o animal
            let verificaRecinto = false;
            for (let i = 0; i < infoAnimal.biomas.length; i++) {
                if (recinto.bioma.includes(infoAnimal.biomas[i])) {
                    verificaRecinto = true;
                }
            }
            if (!verificaRecinto) {
                return;
            }

            // verifica se espécies são iguais e espaço não ocupado 
            let espacoExtra = ((recinto.animaisExistentes.length > 0) && (recinto.animaisExistentes[0].especie != animal)) ? 1 : 0; // 1 se for diferente da espécie que estrará
            let tamanhoRestante = (espacoExtra === 1) ?
                recinto.tamanho - (recinto.animaisExistentes.reduce((tamanhoOcupado, animal) => tamanhoOcupado + (animal.quantidade * animal.tamanho), 0)) - espacoExtra :
                recinto.tamanho - (recinto.animaisExistentes.reduce((tamanhoOcupado, animal) => tamanhoOcupado + (animal.quantidade * animal.tamanho), 0))

            // verifica se tamanho restante é o suficiente para entrada dos novos animais
            if (tamanhoRestante < tamanhoTotalAnimais) {
                return;
            }

            // verificação de espécies carnívoras
            if ((recinto.animaisExistentes.some(a => RecintosZoo.animais[a.especie].carnivoro) || infoAnimal.carnivoro) && (recinto.animaisExistentes.length > 0 && recinto.animaisExistentes[0].especie != animal)) {
                return;
            }

            // restrição hipopótamo
            if (animal === 'HIPOPOTAMO' && recinto.animaisExistentes.length > 0 && recinto.bioma !== 'savana e rio') {
                return;
            }
            // restrição macaco
            if (animal === 'MACACO' && recinto.animaisExistentes.length === 0 && quantidade === 1) {
                return;
            }

            // adiciona recinto
            if (tamanhoRestante >= tamanhoTotalAnimais) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: tamanhoRestante - tamanhoTotalAnimais,
                    espacoTotal: recinto.tamanho
                })
            }
        })

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }

        // Formatar saída
        const resultado = recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`);

        return { recintosViaveis: resultado };
    }

}

export { RecintosZoo as RecintosZoo };
