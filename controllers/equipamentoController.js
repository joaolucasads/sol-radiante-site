const EquipamentoModel = require("../models/equipamentoModel.js");

class EquipamentoController {

    async equipamentoView(req, res) {
        const equipamentoModel = new EquipamentoModel();

        const campo = req.query.campo || null;
        const valor = req.query.valor || null;

        let listaEquipamentos;

        if (campo && valor) {
            listaEquipamentos = await equipamentoModel.filtrar(campo, valor);
        } else {
            listaEquipamentos = await equipamentoModel.listar();
        }

        res.render('admin/equipamentos', {
            equipamentos: listaEquipamentos,
            campoFiltro: campo,
            valorFiltro: valor
        });
    }

    async cadastrar(req, res) {
        const {
            nome, marca, modelo, quantidade_estoque,
            data_aquisicao, valor
        } = req.body;

        if (nome && marca && modelo  && quantidade_estoque && data_aquisicao && valor) {
            const equipamento = new EquipamentoModel(
                0, nome, marca, modelo, quantidade_estoque, data_aquisicao, valor
            );

            const id = await equipamento.cadastrar();

            if (id) {
                res.send({
                    ok: true,
                    msg: "Equipamento cadastrado com sucesso!",
                    equipamento: {
                        id, nome, marca, modelo, quantidade_estoque
                    }
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar equipamento!"
                });
            }
        } else {
            res.send({
                ok: false,
                msg: "Parâmetros preenchidos incorretamente!"
            });
        }
    }

    async excluir(req, res) {
        const id = req.body.id;

        if (!id) {
            return res.send({ ok: false, msg: "ID não informado" });
        }

        const equipamentoModel = new EquipamentoModel();
        const resultado = await equipamentoModel.excluir(id);

        if (resultado) {
            res.send({ ok: true });
        } else {
            res.send({ ok: false, msg: "Erro ao excluir equipamento!" });
        }
    }

    async editar(req, res) {
        const { id } = req.params;
        const {
            nome, marca, modelo, quantidade_estoque,
            data_aquisicao, valor
        } = req.body;

        if (!id || !nome || !marca || !modelo || !quantidade_estoque || !data_aquisicao || !valor) {
            return res.status(400).send({
                ok: false,
                msg: "Dados inválidos para edição."
            });
        }

        const equipamento = new EquipamentoModel(
            id, nome, marca, modelo, quantidade_estoque, data_aquisicao, valor
        );

        const resultado = await equipamento.editar();

        if (resultado) {
            res.send({
                ok: true,
                msg: "Equipamento editado com sucesso!",
                equipamento: {
                    id, nome, marca,modelo, quantidade_estoque
                }
            });
        } else {
            res.send({ ok: false, msg: "Erro ao editar equipamento." });
        }
    }
}

module.exports = EquipamentoController;
