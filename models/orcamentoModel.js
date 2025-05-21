const Database = require("../utils/database");
const banco = new Database();

class OrcamentoModel {
    #clienteId;
    #status;
    #desconto;
    #valorTotal;
    #custoServicoId;
    #consumoMedio;
    #concessionaria;
    #tipoCliente;
    #tipoSistema;
    #capacidadeKwp;
    #economiaEstimada;
    #condicoesPagamento;

    // Getters e Setters
    get clienteId() { return this.#clienteId; }
    set clienteId(value) { this.#clienteId = value; }

    get status() { return this.#status; }
    set status(value) { this.#status = value; }

    get desconto() { return this.#desconto; }
    set desconto(value) { this.#desconto = value; }

    get valorTotal() { return this.#valorTotal; }
    set valorTotal(value) { this.#valorTotal = value; }

    get custoServicoId() { return this.#custoServicoId; }
    set custoServicoId(value) { this.#custoServicoId = value; }

    get consumoMedio() { return this.#consumoMedio; }
    set consumoMedio(value) { this.#consumoMedio = value; }

    get concessionaria() { return this.#concessionaria; }
    set concessionaria(value) { this.#concessionaria = value; }

    get tipoCliente() { return this.#tipoCliente; }
    set tipoCliente(value) { this.#tipoCliente = value; }

    get tipoSistema() { return this.#tipoSistema; }
    set tipoSistema(value) { this.#tipoSistema = value; }

    get capacidadeKwp() { return this.#capacidadeKwp; }
    set capacidadeKwp(value) { this.#capacidadeKwp = value; }

    get economiaEstimada() { return this.#economiaEstimada; }
    set economiaEstimada(value) { this.#economiaEstimada = value; }

    get condicoesPagamento() { return this.#condicoesPagamento; }
    set condicoesPagamento(value) { this.#condicoesPagamento = value; }

    constructor({
        clienteId,
        status,
        desconto,
        valorTotal,
        custoServicoId,
        consumoMedio,
        concessionaria,
        tipoCliente,
        tipoSistema,
        capacidadeKwp,
        economiaEstimada,
        condicoesPagamento
    } = {}) {
        this.#clienteId = clienteId;
        this.#status = status;
        this.#desconto = desconto;
        this.#valorTotal = valorTotal;
        this.#custoServicoId = custoServicoId;
        this.#consumoMedio = consumoMedio;
        this.#concessionaria = concessionaria;
        this.#tipoCliente = tipoCliente;
        this.#tipoSistema = tipoSistema;
        this.#capacidadeKwp = capacidadeKwp;
        this.#economiaEstimada = economiaEstimada;
        this.#condicoesPagamento = condicoesPagamento;
    }


    async cadastrar(listaEquipamentos) {

        
           const sql = `
            INSERT INTO orcamentos (
                cliente_id, status, desconto, valor_total, CustoServico_id,
                media_consumo_kwh, concessionaria, tipo_cliente, tipo_sistema,
                capacidade_kwp, economia_estimativa, condicoes_pagamento
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const valores = [
                this.#clienteId,
                this.#status,
                this.#desconto,
                this.#valorTotal,
                this.#custoServicoId,
                this.#consumoMedio,
                this.#concessionaria,
                this.#tipoCliente,
                this.#tipoSistema,
                this.#capacidadeKwp,
                this.#economiaEstimada,
                this.#condicoesPagamento
            ];
            
            const resultado = await banco.ExecutaComando(sql, valores);
            const idOrcamento = resultado.insertId;
        
            // Primeiro: Verifica se todos os itens têm estoque suficiente
            for (let item of listaEquipamentos) {
                const resultado = await banco.ExecutaComando(
                    `SELECT quantidade_estoque FROM equipamentos WHERE id = ?`,
                    [item.equipamentoId]
                );
        
                const estoqueAtual = resultado[0]?.quantidade_estoque ?? 0;
        
                // Verifica se a quantidade do equipamento excede o estoque
                if (item.quantidade > estoqueAtual) {
                    // Retorna um objeto de erro com a mensagem
                    return {
                        ok: false,
                        msg: `O equipamento ${item.equipamento} tem estoque insuficiente. Estoque atual: ${estoqueAtual}`
                    };
                }
            }
        
            // Se passou na validação de estoque, então realiza os inserts/updates
            for (let item of listaEquipamentos) {
                await banco.ExecutaComando(
                    `INSERT INTO orcamento_equipamentos (orcamento_id, equipamentos_id, quantidade, valor_unitario)
                    VALUES (?, ?, ?, ?)`,
                    [idOrcamento, item.equipamentoId, item.quantidade, item.valorUnitario]
                );
        
                await banco.ExecutaComando(
                    `UPDATE equipamentos SET quantidade_estoque = quantidade_estoque - ?
                    WHERE id = ?`,
                    [item.quantidade, item.equipamentoId]
                );
            }
            
            // Verificar se o status foi alterado para "aprovado" e não há instalação ainda
            if (this.#status === 'Aprovado') {
                // Verifica se já existe uma instalação para esse orçamento
                const instalacoesExistentes = await banco.ExecutaComando(
                    `SELECT id FROM instalacoes WHERE orcamento_id = ?`,
                    [idOrcamento]
                );

                if (instalacoesExistentes.length === 0) {
                    // Inserir nova instalação
                    const dataAtual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
                    await banco.ExecutaComando(
                        `INSERT INTO instalacoes (orcamento_id, status, data_criacao)
                        VALUES (?, ?, ?)`,
                        [idOrcamento, 'Pendente', dataAtual]
                    );
                    console.log(`Instalação criada automaticamente para orçamento ID ${idOrcamento}`);
                }
            }


            // Retorna o ID do orçamento caso o cadastro tenha sido bem-sucedido
            return { ok: true, id: idOrcamento };
        }

    async listar() {
        const sql = `
            SELECT 
                o.id, 
                c.nome_completo AS cliente_nome,
                c.telefone AS cliente_telefone,
                cs.descricao AS servico_descricao,
                o.tipo_cliente,
                o.status,
                o.condicoes_pagamento,
                o.valor_total,
                o.cliente_id,
                o.CustoServico_id
            FROM orcamentos o
            INNER JOIN clientes c ON c.id = o.cliente_id
            INNER JOIN custoservico cs ON cs.id = o.CustoServico_id
            ORDER BY o.id DESC
        `;
        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        try {
            const orcamento = await banco.ExecutaComando(
                `SELECT o.*, 
                        c.nome_completo AS cliente_nome,
                        c.telefone AS cliente_telefone,
                        c.cpf_cnpj AS cliente_cpf_cnpj,
                        c.email AS cliente_email,
                        c.logradouro AS cliente_logradouro,
                        c.numero AS cliente_numero,
                        c.complemento AS cliente_complemento,
                        c.cidade AS cliente_cidade,
                        c.estado AS cliente_estado,
                        c.cep AS cliente_cep,
                        cs.descricao AS servico_descricao,
                        cs.id AS servico_id
                FROM orcamentos o
                INNER JOIN clientes c ON c.id = o.cliente_id
                INNER JOIN custoservico cs ON cs.id = o.CustoServico_id
                WHERE o.id = ?`,
                [id]
            );

            const equipamentos = await banco.ExecutaComando(
                `SELECT e.id, e.nome, e.marca, e.modelo, oe.quantidade, oe.valor_unitario
                FROM orcamento_equipamentos oe
                INNER JOIN equipamentos e ON e.id = oe.equipamentos_id
                WHERE oe.orcamento_id = ?`,
                [id]
            );

            if (!orcamento[0]) throw new Error('Orçamento não encontrado');

            return {
                orcamento: orcamento[0],
                equipamentos
            };
        } catch (err) {
            console.error('Erro na model ao obter orçamento:', err);
            throw err;
        }
    }

    async excluir(id) {
        // 1. Buscar os equipamentos associados ao orçamento
        const equipamentos = await banco.ExecutaComando(`
            SELECT equipamentos_id, quantidade
            FROM orcamento_equipamentos
            WHERE orcamento_id = ?
        `, [id]);

        // 2. Repor os equipamentos no estoque
        for (const eq of equipamentos) {
            await banco.ExecutaComandoNonQuery(`
                UPDATE equipamentos
                SET quantidade_estoque = quantidade_estoque + ?
                WHERE id = ?
            `, [eq.quantidade, eq.equipamentos_id]);
        }

        // 3. Excluir os registros relacionados ao orçamento
        await banco.ExecutaComandoNonQuery(`DELETE FROM orcamento_equipamentos WHERE orcamento_id = ?`, [id]);
        await banco.ExecutaComandoNonQuery(`DELETE FROM instalacoes WHERE orcamento_id = ?`, [id]);
        return await banco.ExecutaComandoNonQuery(`DELETE FROM orcamentos WHERE id = ?`, [id]);
    }


    async filtrar(campo, valor) {
        let sql = `
            SELECT o.id, c.nome_completo AS cliente_nome, cs.descricao AS servico_descricao, 
                   o.status, o.valor_total, c.telefone AS cliente_telefone, 
                   o.tipo_cliente, o.cliente_id, o.condicoes_pagamento
            FROM orcamentos o
            INNER JOIN clientes c ON c.id = o.cliente_id
            INNER JOIN custoservico cs ON cs.id = o.CustoServico_id
            WHERE 1=1
        `;
        const params = [];

        if (campo === "cliente") {
            sql += ` AND c.nome_completo LIKE ?`;
            params.push(`%${valor}%`);
        } else if (campo === "status") {
            sql += ` AND o.status = ?`;
            params.push(valor);
        } else if (campo === "servico") {
            sql += ` AND cs.descricao LIKE ?`;
            params.push(`%${valor}%`);
        } else if (campo === "tipo_cliente") {
            sql += ` AND o.tipo_cliente = ?`;
            params.push(valor);
        }

        sql += ` ORDER BY o.id DESC`;

        return await banco.ExecutaComando(sql, params);
    }

    async atualizar(idOrcamento, dados) {
        const equipamentosNovos = dados.equipamentos || [];

        const sqlUpdate = `
            UPDATE orcamentos SET
                cliente_id = ?, status = ?, desconto = ?, valor_total = ?, CustoServico_id = ?,
                media_consumo_kwh = ?, concessionaria = ?, tipo_cliente = ?, tipo_sistema = ?,
                capacidade_kwp = ?, economia_estimativa = ?, condicoes_pagamento = ?
            WHERE id = ?
        `;

        const valores = [
            this.#clienteId,
            this.#status,
            this.#desconto,
            this.#valorTotal,
            this.#custoServicoId,
            this.#consumoMedio,
            this.#concessionaria,
            this.#tipoCliente,
            this.#tipoSistema,
            this.#capacidadeKwp,
            this.#economiaEstimada,
            this.#condicoesPagamento,
            idOrcamento
        ];

        await banco.ExecutaComando(sqlUpdate, valores);

        const equipamentosAntigos = await banco.ExecutaComando(
            `SELECT equipamentos_id, quantidade FROM orcamento_equipamentos WHERE orcamento_id = ?`,
            [idOrcamento]
        );

        const mapaAntigos = {};
        equipamentosAntigos.forEach(e => {
            mapaAntigos[e.equipamentos_id] = e.quantidade;
        });

        for (let item of equipamentosNovos) {
            const equipamentoId = Number(item.equipamentoId);
            const novaQuantidade = Number(item.quantidade);
            const antigaQuantidade = mapaAntigos[equipamentoId] || 0;
            const diferenca = novaQuantidade - antigaQuantidade;

            if (diferenca > 0) {
                const resultado = await banco.ExecutaComando(
                    `SELECT quantidade_estoque FROM equipamentos WHERE id = ?`,
                    [equipamentoId]
                );
                const estoqueAtual = resultado[0]?.quantidade_estoque ?? 0;

                if (diferenca > estoqueAtual) {
                    throw new Error(`Estoque insuficiente para o equipamento ID ${equipamentoId}. Disponível: ${estoqueAtual}, Necessário: ${diferenca}`);
                }
            }
        }

        const mapaNovos = {};
        equipamentosNovos.forEach(item => {
            mapaNovos[item.equipamentoId] = item;
        });

        // Verificar equipamentos que foram removidos (estavam antes, mas não estão mais)
        for (let antigo of equipamentosAntigos) {
            const equipamentoId = antigo.equipamentos_id;
            if (!mapaNovos[equipamentoId]) {
                // Repor estoque
                await banco.ExecutaComando(
                    `UPDATE equipamentos SET quantidade_estoque = quantidade_estoque + ? WHERE id = ?`,
                    [antigo.quantidade, equipamentoId]
                );

                // Remover do orçamento
                await banco.ExecutaComando(
                    `DELETE FROM orcamento_equipamentos WHERE orcamento_id = ? AND equipamentos_id = ?`,
                    [idOrcamento, equipamentoId]
                );
            }
        }


        for (let item of equipamentosNovos) {
            const equipamentoId = Number(item.equipamentoId);
            const novaQuantidade = Number(item.quantidade);
            const valorUnitario = Number(item.valorUnitario);
            const antigaQuantidade = mapaAntigos[equipamentoId] || 0;
            const diferenca = novaQuantidade - antigaQuantidade;

            if (antigaQuantidade > 0) {
                await banco.ExecutaComando(
                    `UPDATE orcamento_equipamentos SET quantidade = ?, valor_unitario = ? WHERE orcamento_id = ? AND equipamentos_id = ?`,
                    [novaQuantidade, valorUnitario, idOrcamento, equipamentoId]
                );
            } else {
                await banco.ExecutaComando(
                    `INSERT INTO orcamento_equipamentos (orcamento_id, equipamentos_id, quantidade, valor_unitario)
                    VALUES (?, ?, ?, ?)`,
                    [idOrcamento, equipamentoId, novaQuantidade, valorUnitario]
                );
            }

            if (diferenca !== 0) {
                await banco.ExecutaComando(
                    `UPDATE equipamentos SET quantidade_estoque = quantidade_estoque - ? WHERE id = ?`,
                    [diferenca, equipamentoId]
                );
            }
        }

        if (this.#status === 'Aprovado') {
                // Verifica se já existe uma instalação para esse orçamento
                const instalacoesExistentes = await banco.ExecutaComando(
                    `SELECT id FROM instalacoes WHERE orcamento_id = ?`,
                    [idOrcamento]
                );

                if (instalacoesExistentes.length === 0) {
                    // Inserir nova instalação
                    const dataAtual = new Date().toISOString().split('T')[0]; // yyyy-mm-dd
                    await banco.ExecutaComando(
                        `INSERT INTO instalacoes (orcamento_id, status, data_criacao)
                        VALUES (?, ?, ?)`,
                        [idOrcamento, 'Pendente', dataAtual]
                    );
                    console.log(`Instalação criada automaticamente para orçamento ID ${idOrcamento}`);
                }
        }

        return true;
    }
}

module.exports = OrcamentoModel;
