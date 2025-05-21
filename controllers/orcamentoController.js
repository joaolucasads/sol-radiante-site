const OrcamentoModel = require ("../models/orcamentoModel.js")
const ClienteModel = require ("../models/clienteModel.js")
const EquipamentoModel = require ("../models/equipamentoModel.js")
const CustoServicoModel =require ("../models/custoServicoModel.js")

class OrcamentoController {

    async orcamentoView(req, res) {
        const equipamentoModel = new EquipamentoModel();
        const clienteModel = new ClienteModel();
        const custoServicoModel = new CustoServicoModel();
        const orcamentoModel = new OrcamentoModel();

        const campo = req.query.campo || null;
        const valor = req.query.valor || null;

        let listaOrcamentos;

        if (campo && valor) {
            listaOrcamentos = await orcamentoModel.filtrar(campo, valor);
        } else {
            listaOrcamentos = await orcamentoModel.listar();
        }

        const equipamentos = await equipamentoModel.listar();
        const clientes = await clienteModel.listar();
        const custos = await custoServicoModel.listar();

        res.render('admin/orcamentos', {
            orcamentos: listaOrcamentos,
            equipamentos,
            clientes,
            custos,
            campoFiltro: campo,
            valorFiltro: valor
        });
    }

    async cadastrar(req, res) {
        try {
            const {
                cliente_id,
                status,
                desconto = 0,
                valor_total,
                servico_id,
                media_consumo,
                concessionaria,
                tipo_cliente,
                tipo_sistema,
                capacidade_kwp,
                economia_estimada,
                condicoes_pagamento,
                equipamentos = []
            } = req.body;

            const orcamentoModel = new OrcamentoModel({
                clienteId: cliente_id,
                status,
                desconto,
                valorTotal: valor_total,
                custoServicoId: servico_id,
                consumoMedio: media_consumo,
                concessionaria,
                tipoCliente: tipo_cliente,
                tipoSistema: tipo_sistema,
                capacidadeKwp: capacidade_kwp,
                economiaEstimada: economia_estimada,
                condicoesPagamento: condicoes_pagamento,
            });

            console.log(equipamentos)

            const resultadoCadastro = await orcamentoModel.cadastrar(equipamentos);

            if (!resultadoCadastro.ok) {
                return res.status(400).json({
                    erro: 'Erro ao cadastrar orçamento.',
                    msg: resultadoCadastro.msg || 'Estoque insuficiente.'
                });
            }

            res.status(201).json({ id: resultadoCadastro.id });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                erro: 'Erro ao cadastrar orçamento.',
                detalhes: err.message
            });
        }
    }

    async buscarPorId(req, res) {
        const orcamentoModel = new OrcamentoModel();
        const id = req.params.id;

        try {
            const orcamento = await orcamentoModel.obter(id);
            if (!orcamento) {
                return res.status(404).json({ erro: 'Orçamento não encontrado.' });
            }
            res.json(orcamento);
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao buscar orçamento.', detalhes: err.message });
        }
    }

    async atualizar(req, res) {
        try {
            const {
                cliente_id,
                status,
                desconto = 0,
                valor_total,
                servico_id,
                media_consumo,
                concessionaria,
                tipo_cliente,
                tipo_sistema,
                capacidade_kwp,
                economia_estimada,
                condicoes_pagamento,
                equipamentos = []
            } = req.body;

            const orcamentoModel = new OrcamentoModel({
                clienteId: cliente_id,
                status,
                desconto,
                valorTotal: valor_total,
                custoServicoId: servico_id,
                consumoMedio: media_consumo,
                concessionaria,
                tipoCliente: tipo_cliente,
                tipoSistema: tipo_sistema,
                capacidadeKwp: capacidade_kwp,
                economiaEstimada: economia_estimada,
                condicoesPagamento: condicoes_pagamento,
            });

            const id = req.params.id;

            // Envia todos os dados para o método atualizar da model
            const atualizado = await orcamentoModel.atualizar(id, {
                equipamentos
            });

            if (!atualizado) {
                return res.status(404).json({ erro: 'Orçamento não encontrado para atualizar.' });
            }

            res.json({ mensagem: 'Orçamento atualizado com sucesso.' });
        } catch (err) {
            res.status(400).json({ erro: 'Erro ao atualizar orçamento.', msg: err.message });
        }
    }

    async excluir(req, res) {
        const orcamentoModel = new OrcamentoModel();
        const id = req.params.id;
        try {
            const excluido = await orcamentoModel.excluir(id);
            if (!excluido) {
                return res.status(404).json({ erro: 'Orçamento não encontrado para excluir.' });
            }
            res.json({ mensagem: 'Orçamento excluído com sucesso.' });
        } catch (err) {
            res.status(500).json({ erro: 'Erro ao excluir orçamento.', detalhes: err.message });
        }
    }
}

module.exports = OrcamentoController;
