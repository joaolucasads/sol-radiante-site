const UsuarioModel = require("../models/usuarioModel");

class AuthMiddleware {

    async verificarUsuarioLogado(req, res, next) {
        if (req.cookies && req.cookies.usuarioLogado) {
            let usuarioId = req.cookies.usuarioLogado;
            const usuarioModel = new UsuarioModel();
            const usuario = await usuarioModel.obter(usuarioId);

            if (usuario) {
                res.locals.usuarioLogado = usuario;
                next();
            } else {
                res.redirect("/admin");
            }
        } else {
            res.redirect("/admin");
        }
    }

    // Novo método: apenas administrador (perfil_id = 1)
    async apenasAdmin(req, res, next) {
        const usuario = res.locals.usuarioLogado;

        // Se ainda não tiver o usuário, verifica e carrega manualmente
        if (!usuario && req.cookies?.usuarioLogado) {
            const usuarioModel = new UsuarioModel();
            res.locals.usuarioLogado = await usuarioModel.obter(req.cookies.usuarioLogado);
        }

        if (Number(res.locals.usuarioLogado?.perfilId) === 1) {
            next();
        }
        else {
            return res.status(403).render('admin/erro403'); // ou res.send("Acesso negado");
        }
    }
}

module.exports = AuthMiddleware;
