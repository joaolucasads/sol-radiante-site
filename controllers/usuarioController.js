const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class usuarioController {


        async usuarioView(req, res) {
            const perfilModel = new PerfilModel();
            const usuarioModel = new UsuarioModel();

            const campo = req.query.campo || null;
            const valor = req.query.valor || null;

            let listaUsuarios;

            if (campo && valor) {
                listaUsuarios = await usuarioModel.filtrar(campo, valor);
            } else {
                listaUsuarios = await usuarioModel.listar();
            }

            const listaPerfil = await perfilModel.listar();

            res.render('admin/usuarios', {
                listaPerfil,
                listaUsuarios,
                campoFiltro: campo,
                valorFiltro: valor
            });
        }


        async cadastrar(req, res) {
        if (req.body.email && req.body.senha && req.body.nome && req.body.perfil !== '0') {
            let usuario = new UsuarioModel(
                0,
                req.body.nome,
                req.body.senha,
                req.body.perfil,
                req.body.email
            );

            let id = await usuario.cadastrar();

            if (id) {
                let perfilModel = new PerfilModel();
                let perfis = await perfilModel.listar();

                let perfilId = parseInt(req.body.perfil);
                let perfilNome = perfis.find(p => p.id === perfilId)?.nome || "";

                res.send({
                    ok: true,
                    msg: "Usuário cadastrado com sucesso!",
                    usuario: {
                        id,
                        nome: req.body.nome,
                        email: req.body.email,
                        perfil: perfilNome
                    }
                });
            } else {
                res.send({
                    ok: false,
                    msg: "Erro ao cadastrar usuário!"
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

            let usuario = new UsuarioModel();
            let resultado = await usuario.excluir(id);

            if (resultado) {
                res.send({ ok: true });
            } else {
                res.send({ ok: false, msg: "Erro ao excluir usuário!" });
            }
        }

        async editar(req, res) {
            const { id } = req.params;
            const { nome, email, senha, perfil } = req.body;

            if (!id || !nome || !email || !senha || !perfil || perfil === '0') {
                return res.status(400).send({
                    ok: false,
                    msg: "Dados inválidos para edição."
                });
            }

            const usuarioModel = new UsuarioModel();
            const resultado = await usuarioModel.editar({ id, nome, email, senha, perfil });

            if (resultado) {
                const perfilModel = new PerfilModel();
                const perfis = await perfilModel.listar();
                const perfilNome = perfis.find(p => p.id === parseInt(perfil))?.nome || "";

                res.send({
                    ok: true,
                    msg: "Usuário editado com sucesso!",
                    usuario: { id, nome, email, perfil: perfilNome }
                });
            } else {
                res.send({ ok: false, msg: "Erro ao editar usuário." });
            }
        }

}

module.exports = usuarioController;