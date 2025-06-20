const UsuarioModel = require("../models/usuarioModel");
const RecuperacaoModel = require("../models/recuperacaoSenhaModel");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
//const bcrypt = require("bcrypt.js");

//const { ociHttpRequest } = require("../ociHttpRequest");

class RecuperacaoSenhaController {

    formularioSolicitarView(req, res) {

        res.render('admin/esqueci-minha-senha', { layout: false, msg: null });
    }

    async formularioRedefinirView(req, res) {
        const token = req.params.token;

        const recModel = new RecuperacaoModel();
        const registro = await recModel.obterPorToken(token);

        if (!registro || new Date(registro.expiresAt) < new Date()) {
            return res.send("Token inválido ou expirado.");
        }

        res.render('admin/redefinir-senha', { layout: 'admin/login', token });
    }

    gerarSequenciaNumeros(totalNumeros) {
        const sequencia = [];
        while (sequencia.length < totalNumeros) {
            const numero = Math.floor(Math.random() * 100) + 1; // Gera número entre 1 e 100
            if (!sequencia.includes(numero)) { // Verifica se o número já está na sequência
                sequencia.push(numero);
            }
        }
        return sequencia;
    }

    async redefinirSenha(req, res) {

        let email = req.body.email;
        let usuario = new UsuarioModel();
        usuario = await usuario.obterPorEmail(email);
        if(usuario != null) {


            let token = "";
            while (token.length < 6) {
                const numero = Math.floor(Math.random() * 100) + 1; // Gera número entre 1 e 100
                token += numero.toString();
            }
            let recupera = new RecuperacaoModel();
            const dataAtual = new Date();
            dataAtual.setHours(dataAtual.getHours() + 1);
            recupera.usuarioId = usuario.usuarioId;
            recupera.token = token;
            recupera.expiraEm = dataAtual;

            if(await recupera.cadastrar() > 0) {

                // Configuração do transportador de e-mail
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'joaodrivelucas@gmail.com', // Seu e-mail
                        pass: 'zbpd owki dbln hvdg' // Sua senha ou app password
                    }
                });

                // Detalhes do e-mail
                let mailOptions = {
                    from: 'joaodrivelucas@gmail.com', // Endereço de e-mail do remetente
                    to: email,
                    subject: "Codigo de recuperação",
                    //text: 'Conteúdo do e-mail em texto simples',
                    html: `Prezado usuário, utilize o código abaixo para prosseguir com a redefinição de senha<br><br><b>Código de redefinição: ${token}<b>`
                };

                // Enviar e-mail
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('E-mail enviado: ' + info.response);
                });

                res.render('admin/redefinir-senha', { layout: false, msg: "Código de recuperação enviado!" });
            }
            else {
                res.render('admin/esqueci-minha-senha', { layout: false, msg: "Erro ao processar recuperação de senha!" });
            }
        }
        else {
            res.render('admin/esqueci-minha-senha', { layout: false, msg: "E-mail inválido!" });
        }
    }
           

        async redefinirSenhaPersistir(req, res) {
            const { codigo, novaSenha } = req.body;

            const recModel = new RecuperacaoModel();
            const registro = await recModel.obterPorToken(codigo);

            if (!registro) {
                return res.render('admin/redefinir-senha', { layout: 'admin/login', msg: "Código inválido." });
            }

            if (new Date(registro.expiraAt) < new Date()) {
                return res.render('admin/redefinir-senha', { layout: 'admin/login', msg: "Código expirado." });
            }

            const usuarioModel = new UsuarioModel();
            const usuario = await usuarioModel.obter(registro.usuarioId);

            if (!usuario) {
                return res.render('admin/redefinir-senha', { layout: 'admin/login', msg: "Usuário não encontrado." });
            }

            await usuarioModel.atualizarSenha(usuario.usuarioId, novaSenha); // Crie esse método no seu model

            await recModel.excluirToken(codigo); // Ou marque como usado, se preferir

            res.render('admin/login', { layout: 'admin/login', msgS: "Senha redefinida com sucesso. Faça o login." });
        }

}

module.exports = RecuperacaoSenhaController;
