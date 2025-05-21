const InstalacaoModel = require("../models/instalacaoModel.js");

class InstalacaoController {

    async gerarInstalacao(req, res) {
        const { orcamento_id, status, data_criacao, data_conclusao, observacoes } = req.body;

        console.log("Recebido no backend:", req.body);


        if (!orcamento_id || !status || !data_criacao) {
            return res.status(400).send({
                ok: false,
                msg: "Parâmetros obrigatórios ausentes: orcamento_id, status ou data_criacao."
            });
        }

        const instalacao = new InstalacaoModel(null, orcamento_id, status, data_criacao, data_conclusao, observacoes);

        try {
            const id = await instalacao.cadastrar();
            res.status(201).send({
                ok: true,
                msg: "Instalação cadastrada com sucesso!",
                instalacao: { id }
            });
        } catch (error) {
            res.status(500).send({
                ok: false,
                msg: "Erro ao cadastrar instalação",
                erro: error.message
            });
        }
    }

   async instalacaoPorId(req, res) {
        const { id } = req.params;
        const instalacaoModel = new InstalacaoModel();

        try {
            const listaBruta = await instalacaoModel.obter(id); // função deve retornar a mesma estrutura da listagem

            if (!listaBruta || listaBruta.length === 0) {
                return res.status(404).json({ ok: false, msg: "Instalação não encontrada" });
            }

            const rowInicial = listaBruta[0];

            const instalacao = {
                instalacao_id: rowInicial.instalacao_id,
                status: rowInicial.status,
                data_criacao: rowInicial.data_criacao,
                data_conclusao: rowInicial.data_conclusao,
                observacoes: rowInicial.observacoes,
                nome_completo: rowInicial.nome_completo || rowInicial.cliente_nome,
                telefone: rowInicial.telefone || '',
                logradouro: rowInicial.logradouro || '',
                numero: rowInicial.numero || '',
                complemento: rowInicial.complemento || '',
                cidade: rowInicial.cidade || '',
                estado: rowInicial.estado || '',
                cep: rowInicial.cep || '',
                servico: rowInicial.servico || rowInicial.servico_descricao,
                tipo_cliente: rowInicial.tipo_cliente || '',
                tipo_sistema: rowInicial.tipo_sistema || '',
                equipamentos: []
            };

            for (let row of listaBruta) {
                if (row.equipamento) {
                    instalacao.equipamentos.push({
                        nome: row.equipamento,
                        marca: row.marca,
                        quantidade: row.quantidade,
                        valor_unitario: row.valor_unitario
                    });
                }
            }

            res.json({ ok: true, instalacao });

        } catch (error) {
            res.status(500).json({
                ok: false,
                msg: "Erro ao buscar instalação",
                erro: error.message
            });
        }
    }


   async instalacoesView(req, res) {
        const { campo, valor } = req.query;
        const instalacaoModel = new InstalacaoModel();

        try {
            const listaBruta = campo && valor
                ? await instalacaoModel.filtrar(campo, valor)
                : await instalacaoModel.listar();

            const agrupada = [];

            for (let row of listaBruta) {
                let existente = agrupada.find(i => i.instalacao_id === row.instalacao_id);

                if (!existente) {
                    existente = {
                        instalacao_id: row.instalacao_id,
                        status: row.status,
                        data_criacao: row.data_criacao,
                        data_conclusao: row.data_conclusao,
                        observacoes: row.observacoes,
                        nome_completo: row.nome_completo || row.cliente_nome, // <- garantir compatibilidade
                        logradouro: row.logradouro || '',
                        numero: row.numero || '',
                        complemento: row.complemento || '',
                        cidade: row.cidade || '',
                        estado: row.estado || '',
                        cep: row.cep || '',
                        servico: row.servico || row.servico_descricao, // <- garantir compatibilidade
                        equipamentos: []
                    };
                    agrupada.push(existente);
                }

                if (row.equipamento) {
                    existente.equipamentos.push({
                        nome: row.equipamento,
                        marca: row.marca,
                        quantidade: row.quantidade,
                        valor_unitario: row.valor_unitario
                    });
                }
            }
            const usuario = res.locals.usuarioLogado;
            res.render('admin/instalacoes', {
                lista: agrupada,
                perfilId: usuario.perfilId,
                campoFiltro: campo || '',
                valorFiltro: valor || ''
            });

        } catch (error) {
            res.status(500).send({
                ok: false,
                msg: "Erro ao listar instalações",
                erro: error.message
            });
        }
    }



    async editarInstalacao(req, res) {
        const { id } = req.params;
        const { status, observacoes } = req.body;

        if (!id || !status) {
            return res.status(400).send({
                ok: false,
                msg: "ID e Status são obrigatórios."
            });
        }

        const dataConclusao = status === "Concluída" ? new Date().toISOString().split('T')[0] : null;

        try {
            const instalacao = new InstalacaoModel();

            const resultado = await instalacao.editar(id, status, dataConclusao, observacoes);

            if (resultado) {
                return res.send({ ok: true, msg: "Instalação atualizada com sucesso!" });
            } else {
                return res.send({ ok: false, msg: "Falha ao atualizar instalação." });
            }
        } catch (err) {
            return res.status(500).send({
                ok: false,
                msg: "Erro interno ao editar instalação",
                erro: err.message
            });
        }
    }

    async excluirInstalacao(req, res) {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ ok: false, msg: "ID não informado para exclusão." });
        }

        const instalacaoModel = new InstalacaoModel();

        try {
            const resultado = await instalacaoModel.excluir(id);
            if (resultado) {
                res.send({ ok: true, msg: "Instalação excluída com sucesso." });
            } else {
                res.send({ ok: false, msg: "Erro ao excluir instalação." });
            }
        } catch (error) {
            res.status(500).send({
                ok: false,
                msg: "Erro ao excluir instalação",
                erro: error.message
            });
        }
    }
}

module.exports = InstalacaoController;


