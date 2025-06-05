const UsuarioModel = require("../models/usuarioModel");
const RecuperacaoModel = require("../models/recuperacaoSenhaModel");
const crypto = require("crypto");
//const bcrypt = require("bcrypt.js");

//const { ociHttpRequest } = require("../ociHttpRequest");

class RecuperacaoSenhaController {

    formularioSolicitarView(req, res) {
        res.render('admin/esqueci-minha-senha', { layout: 'admin/login', msg: null });
    }

    async solicitarToken(req, res) {
        const email = req.body.email;

        const usuarioModel = new UsuarioModel();
        const usuario = await usuarioModel.obterPorEmail(email);

        if (!usuario) {
            return res.render('admin/esqueci-minha-senha', {
                layout: 'admin/login',
                msg: "Email não encontrado."
            });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiracao = new Date(Date.now() + 60 * 60 * 1000); // 1h

        const recModel = new RecuperacaoModel();
        await recModel.salvarToken(usuario.usuarioId, token, expiracao);

        // Montar o link
        const link = `http://localhost:3000/admin/redefinir-senha/${token}`;

        // Enviar email via Oracle Cloud
        const emailPayload = {
            senderEmail: 'seuemail@gmail.com',
            senderName: 'Suporte Sistema',
            recipient: email,
            subject: 'Recuperação de Senha',
            body: `Clique no link para redefinir sua senha: ${link}`
        };

        await ociHttpRequest('URL_DA_FUNCAO_OCI', 'POST', emailPayload);

        res.render('admin/esqueci-minha-senha', {
            layout: 'admin/login',
            msg: "Email enviado com instruções para redefinir a senha."
        });
    }

    async formularioRedefinirView(req, res) {
        const token = req.params.token;

        const recModel = new RecuperacaoModel();
        const registro = await recModel.obterPorToken(token);

        if (!registro || new Date(registro.expira_em) < new Date()) {
            return res.send("Token inválido ou expirado.");
        }

        res.render('admin/redefinir-senha', { layout: 'admin/login', token });
    }

    async redefinirSenha(req, res) {
        const { token, novaSenha } = req.body;

        const recModel = new RecuperacaoModel();
        const registro = await recModel.obterPorToken(token);

        if (!registro || new Date(registro.expira_em) < new Date()) {
            return res.send("Token inválido ou expirado.");
        }

        const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

        const usuarioModel = new UsuarioModel();
        await usuarioModel.atualizarSenha(registro.usuario_id, senhaCriptografada);

        await recModel.excluirToken(token);

        res.render('admin/login', {
            layout: 'admin/login',
            msg: "Senha redefinida com sucesso. Faça login novamente."
        });
    }
}

module.exports = RecuperacaoSenhaController;
