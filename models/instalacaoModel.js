const Database = require("../utils/database");
const banco = new Database();

class InstalacaoModel {
    #id;
    #orcamentoId;
    #status;
    #dataCriacao;
    #dataConclusao;
    #observacoes;

    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get orcamentoId() { return this.#orcamentoId; }
    set orcamentoId(orcamentoId) { this.#orcamentoId = orcamentoId; }

    get status() { return this.#status; }
    set status(status) { this.#status = status; }

    get dataCriacao() { return this.#dataCriacao; }
    set dataCriacao(dataCriacao) { this.#dataCriacao = dataCriacao; }

    get dataConclusao() { return this.#dataConclusao; }
    set dataConclusao(dataConclusao) { this.#dataConclusao = dataConclusao; }

    get observacoes() { return this.#observacoes; }
    set observacoes(observacoes) { this.#observacoes = observacoes; }

    constructor(id, orcamentoId, status, dataCriacao, dataConclusao, observacoes) {
        this.#id = id;
        this.#orcamentoId = orcamentoId;
        this.#status = status;
        this.#dataCriacao = dataCriacao;
        this.#dataConclusao = dataConclusao;
        this.#observacoes = observacoes;
    }

    async cadastrar() {
        const sql = `
            INSERT INTO instalacoes 
            (orcamento_id, status, data_criacao, data_conclusao, observacoes)
            VALUES (?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#orcamentoId,
            this.#status,
            this.#dataCriacao,
            this.#dataConclusao,
            this.#observacoes
        ];
        const resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId;
    }

    

    async listar() {
        const sql = `
            SELECT 
                i.id AS instalacao_id,
                i.status,
                i.data_criacao,
                i.data_conclusao,
                i.observacoes,

                c.nome_completo,
                c.logradouro, c.numero, c.complemento, c.cidade, c.estado, c.cep,

                cs.descricao AS servico,

                e.nome AS equipamento,
                e.marca,
                oe.quantidade,
                oe.valor_unitario

            FROM instalacoes i
            JOIN orcamentos o ON i.orcamento_id = o.id
            JOIN clientes c ON o.cliente_id = c.id
            JOIN custoservico cs ON o.CustoServico_id = cs.id
            LEFT JOIN orcamento_equipamentos oe ON oe.orcamento_id = o.id
            LEFT JOIN equipamentos e ON oe.equipamentos_id = e.id
        `;

        return await banco.ExecutaComando(sql);
    }


    async obter(id) {

        const sql = `
            SELECT 
                i.id AS instalacao_id,
                i.status,
                i.data_criacao,
                i.data_conclusao,
                i.observacoes,

                c.nome_completo,
                c.telefone,
                c.logradouro, 
                c.numero, 
                c.complemento, 
                c.cidade, 
                c.estado, 
                c.cep,

                cs.descricao AS servico,

                e.nome AS equipamento,
                e.marca,
                oe.quantidade,
                oe.valor_unitario,
                o.tipo_cliente,
                o.tipo_sistema

            FROM instalacoes i
            INNER JOIN orcamentos o ON i.orcamento_id = o.id
            INNER JOIN clientes c ON o.cliente_id = c.id
            INNER JOIN custoservico cs ON o.custoservico_id = cs.id
            LEFT JOIN orcamento_equipamentos oe ON oe.orcamento_id = o.id
            LEFT JOIN equipamentos e ON oe.equipamentos_id = e.id

            WHERE i.id = ?
        `;

        try {
            const rows = await banco.ExecutaComando(sql, [id]);
            if (rows.length === 0) {
                console.warn("Nenhum resultado encontrado para o ID:", id);
            }

            return rows;
        } catch (error) {
            console.error("Erro ao obter instalação:", error);
            throw error;
        }
}



    async excluir(id) {
        const sql = "DELETE FROM instalacoes WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async editar(id, status, dataConclusao, observacoes) {
        const sql = `
            UPDATE instalacoes SET 
                status = ?, 
                data_conclusao = ?, 
                observacoes = ?
            WHERE id = ?
        `;
        const valores = [status, dataConclusao, observacoes || null, id];
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }


    async filtrar(campo, valor) {
            let sql = `
                SELECT 
                    i.id AS instalacao_id,
                    i.status,
                    i.data_criacao,
                    i.data_conclusao,
                    i.observacoes,

                    c.nome_completo,
                    c.logradouro, c.numero, c.complemento, c.cidade, c.estado, c.cep,

                    cs.descricao AS servico,

                    e.nome AS equipamento,
                    e.marca,
                    oe.quantidade,
                    oe.valor_unitario

                FROM instalacoes i
                JOIN orcamentos o ON i.orcamento_id = o.id
                JOIN clientes c ON o.cliente_id = c.id
                JOIN custoservico cs ON o.CustoServico_id = cs.id
                LEFT JOIN orcamento_equipamentos oe ON oe.orcamento_id = o.id
                LEFT JOIN equipamentos e ON oe.equipamentos_id = e.id
                WHERE 1=1
            `;

            const params = [];

            if (campo === "cliente") {
                sql += " AND c.nome_completo LIKE ?";
                params.push(`%${valor}%`);
            } else if (campo === "status") {
                sql += " AND i.status = ?";
                params.push(valor);
            } else if (campo === "servico") {
                sql += " AND cs.descricao LIKE ?";
                params.push(`%${valor}%`);
            }

            sql += " ORDER BY i.id DESC";

            return await banco.ExecutaComando(sql, params);
    }


}

module.exports = InstalacaoModel;