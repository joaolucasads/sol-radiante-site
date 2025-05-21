const ClienteModel = require("../models/clienteModel.js");

class clienteController {

    async clienteView(req, res) {
        const clienteModel = new ClienteModel();

        const campo = req.query.campo || null;
        const valor = req.query.valor || null;

        let listaClientes;

        if (campo && valor) {
            listaClientes = await clienteModel.filtrar(campo, valor);
        } else {
            listaClientes = await clienteModel.listar();
        }

        res.render('admin/clientes', {
            clientes: listaClientes,
            campoFiltro: campo,
            valorFiltro: valor
        });
    }

    async cadastrar(req, res) {
        const {
            nome_completo, cpf_cnpj, email, telefone,
            logradouro, numero, complemento, cidade, estado, cep
        } = req.body;

        if (nome_completo && cpf_cnpj && email && telefone && logradouro && numero && cidade && estado && cep) {
            const cliente = new ClienteModel(
                0, nome_completo, cpf_cnpj, email, telefone,
                logradouro, numero, complemento, cidade, estado, cep
            );

            const id = await cliente.cadastrar();

            if (id) {
                res.send({
                    ok: true,
                    msg: "Cliente cadastrado com sucesso!",
                    cliente: {
                        id, nome_completo, cpf_cnpj, email, telefone
                    }
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar cliente!"
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

        const clienteModel = new ClienteModel();
        const resultado = await clienteModel.excluir(id);

        if (resultado) {
            res.send({ ok: true });
        } else {
            res.send({ ok: false, msg: "Erro ao excluir cliente!" });
        }
    }

    async editar(req, res) {
        const { id } = req.params;
        const {
            nome_completo, cpf_cnpj, email, telefone,
            logradouro, numero, complemento, cidade, estado, cep
        } = req.body;

        if (!id || !nome_completo || !cpf_cnpj || !email || !telefone || !logradouro || !numero || !cidade || !estado || !cep) {
            return res.status(400).send({
                ok: false,
                msg: "Dados inválidos para edição."
            });
        }

        const cliente = new ClienteModel(
            id, nome_completo, cpf_cnpj, email, telefone,
            logradouro, numero, complemento, cidade, estado, cep
        );

        const resultado = await cliente.editar();

        if (resultado) {
            res.send({
                ok: true,
                msg: "Cliente editado com sucesso!",
                cliente: {
                    id, nome_completo, cpf_cnpj, email, telefone
                }
            });
        } else {
            res.send({ ok: false, msg: "Erro ao editar cliente." });
        }
    }
}

module.exports = clienteController;
