const ContatoModel = require("../models/contatoModel");

class contatoController {
    async contatoView(req, res) {
        const contatoModel = new ContatoModel();

        const campo = req.query.campo || null;
        const valor = req.query.valor || null;

        let listaContatos;

        if (campo && valor) {
            listaContatos = await contatoModel.filtrar(campo, valor);
        } else {
            listaContatos = await contatoModel.listar();
        }

        res.render('admin/contatos', {
            listaContatos,
            campoFiltro: campo,
            valorFiltro: valor
        });
    }

    async cadastrar(req, res) {
        const { nome, telefone, email, estado, cidade, assunto, mensagem } = req.body;

        if (!nome || !email || !estado || !cidade || !assunto || !mensagem) {
            return res.send({ ok: false, msg: "Campos obrigatórios não preenchidos." });
        }

        const contato = new ContatoModel(0, nome, telefone, email, estado, cidade, assunto, mensagem);
        const id = await contato.cadastrar();

        if (id) {
            res.send({
                ok: true,
                msg: "Contato enviado com sucesso!",
                contato: { id, nome, email, estado, cidade, assunto, mensagem }
            });
        } else {
            res.send({ ok: false, msg: "Erro ao cadastrar contato." });
        }
    }

    async excluir(req, res) {
        const id = req.params.id;

        if (!id) {
            return res.send({ ok: false, msg: "ID não informado" });
        }

        const contato = new ContatoModel();
        const resultado = await contato.excluir(id);

        if (resultado) {
            res.send({ ok: true });
        } else {
            res.send({ ok: false, msg: "Erro ao excluir contato!" });
        }
    }
}

module.exports = contatoController;
