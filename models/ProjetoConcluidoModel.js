const Database = require("../utils/database");
const banco = new Database();

class ProjetoConcluidoModel {
    #id;
    #imagem;
    #descricao;

    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get imagem() { return this.#imagem; }
    set imagem(imagem) { this.#imagem = imagem; }

    get descricao() { return this.#descricao; }
    set descricao(descricao) { this.#descricao = descricao; }

    constructor(id, imagem, descricao) {
        this.#id = id;
        this.#imagem = imagem;
        this.#descricao = descricao;
    }

    async cadastrar() {
        const sql = `
            INSERT INTO projetos_concluidos (imagem, descricao)
            VALUES (?, ?)
        `;
        const valores = [this.#imagem, this.#descricao];
        const resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId;
    }

    async listar() {
        const sql = "SELECT * FROM projetos_concluidos ORDER BY id DESC";
        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        const sql = "SELECT * FROM projetos_concluidos WHERE id = ?";
        const rows = await banco.ExecutaComando(sql, [id]);
        if (rows.length > 0) {
            const row = rows[0];
            return new ProjetoConcluidoModel(row.id, row.imagem, row.descricao);
        }
        return null;
    }

    async editar() {
        let sql;
        let valores;
    
        if (this.#imagem) {
            sql = `
                UPDATE projetos_concluidos 
                SET imagem = ?, descricao = ? 
                WHERE id = ?
            `;
            valores = [this.#imagem, this.#descricao, this.#id];
        } else {
            sql = `
                UPDATE projetos_concluidos 
                SET descricao = ? 
                WHERE id = ?
            `;
            valores = [this.#descricao, this.#id];
        }
    
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }
    

    async excluir(id) {
        const sql = "DELETE FROM projetos_concluidos WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = ProjetoConcluidoModel;
