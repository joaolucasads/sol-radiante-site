const PerfilModel = require("../models/perfilModel");
const UsuarioModel = require("../models/usuarioModel");

class adminController {

    async adminView(req, res) {
        const user = new UsuarioModel()
        const usuario = await user.listar();
        res.render('admin/inicio', {
            usuario: usuario, // Aqui vai o objeto inteiro
            perfilId: usuario.perfil_id, // Agora você envia o perfil com nome correto
            nome: usuario.nome
        });

    }


    loginView(req, res) {
        res.clearCookie("usuarioLogado");
        res.render('admin/login', { layout: 'admin/login' });
    }

    

    async login(req, res) {
        let msg = "";
        if (req.body.nome && req.body.password) {
            let usuario = new UsuarioModel();
            usuario = await usuario.obterPorUsuarioSenha(req.body.nome, req.body.password);
            if (usuario) {
                res.cookie("usuarioLogado", usuario.usuarioId);
                return res.redirect("/admin/inicio");
            } else {
                msg = "Usuário/Senha incorretos!";
            }
        } else {
            msg = "Usuário/Senha incorretos!";
        }

        res.render('admin/login', { msg: msg, layout: 'admin/login' });
    }
}

module.exports = adminController;
