const Database = require("../utils/database");
const banco = new Database();

class EquipamentoModel {
    #id;
    #nome;
    #marca;
    #modelo;
    #quantidadeEstoque;
    #dataAquisicao;
    #valor;

    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get nome() { return this.#nome; }
    set nome(nome) { this.#nome = nome; }

    get marca() { return this.#marca; }
    set marca(marca) { this.#marca = marca; }

    get modelo() { return this.#modelo; }
    set modelo(modelo) { this.#modelo = modelo; }

    get quantidadeEstoque() { return this.#quantidadeEstoque; }
    set quantidadeEstoque(qtd) { this.#quantidadeEstoque = qtd; }

    get dataAquisicao() { return this.#dataAquisicao; }
    set dataAquisicao(data) { this.#dataAquisicao = data; }

    get valor() { return this.#valor; }
    set valor(valor) { this.#valor = valor; }

    constructor(id, nome, marca, modelo, quantidadeEstoque, dataAquisicao, valor) {
        this.#id = id;
        this.#nome = nome;
        this.#marca = marca;
        this.#modelo = modelo;
        this.#quantidadeEstoque = quantidadeEstoque;
        this.#dataAquisicao = dataAquisicao;
        this.#valor = valor;
    }

    async cadastrar() {
        const sql = `
            INSERT INTO equipamentos 
            (nome, marca, modelo, quantidade_estoque, data_aquisicao, valor) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const valores = [this.#nome, this.#marca, this.#modelo, this.#quantidadeEstoque, this.#dataAquisicao, this.#valor];
        const resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId;
    }

    async listar() {
        const sql = "SELECT * FROM equipamentos";
        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        const sql = "SELECT * FROM equipamentos WHERE id = ?";
        const rows = await banco.ExecutaComando(sql, [id]);
        if (rows.length > 0) {
            const row = rows[0];
            return new EquipamentoModel(row.id, row.nome, row.marca, row.modelo, row.quantidade_estoque, row.data_aquisicao, row.valor);
        }
        return null;
    }

    async excluir(id) {
        const sql = "DELETE FROM equipamentos WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async editar() {
        const sql = `
            UPDATE equipamentos SET 
                nome = ?, marca = ?, modelo = ?, quantidade_estoque = ?, 
                data_aquisicao = ?, valor = ?
            WHERE id = ?
        `;
        const valores = [
            this.#nome, this.#marca, this.#modelo, this.#quantidadeEstoque,
            this.#dataAquisicao, this.#valor,
            this.#id
        ];
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async filtrar(campo, valor) {
        const camposPermitidos = {
            id: "id",
            nome: "nome",
            marca: "marca",
            data: "data_aquisicao"
        };

        const campoValido = camposPermitidos[campo];
        if (!campoValido) return [];

        const sql = `SELECT * FROM equipamentos WHERE ${campoValido} LIKE ?`;
        return await banco.ExecutaComando(sql, [`%${valor}%`]);
    }
}

module.exports = EquipamentoModel;
