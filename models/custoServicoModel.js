const Database = require("../utils/database");

const banco = new Database();

class CustoServicoModel {

    #id
    #descricao
    #valor

    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get descricao() { return this.#descricao; }
    set descricao(descricao) { this.#descricao = descricao; }

    get valor() { return this.#valor; }
    set valor(valor) { this.#valor = valor; }

    constructor(id, descricao, valor) {
        this.#id = id;
        this.#descricao = descricao;
        this.#valor = valor;
    }

    async listar() {
        const sql = "SELECT * FROM custoservico";
        return await banco.ExecutaComando(sql);
    }

}

module.exports = CustoServicoModel