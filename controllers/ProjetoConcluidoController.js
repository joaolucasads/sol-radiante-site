const ProjetoConcluidoModel = require("../models/ProjetoConcluidoModel");
const fs = require("fs");
const path = require("path");

class ProjetoConcluidoController {

    async projetosView(req, res) {
        const projetoModel = new ProjetoConcluidoModel();
        const listaProjetos = await projetoModel.listar();

        res.render('admin/projetos', {
            projetos: listaProjetos
        });
    }

    async cadastrar(req, res) {
        const { descricao } = req.body;
        const imagem = req.file?.filename;

        if (!imagem || !descricao || descricao.length > 500) {
            return res.send({
                ok: false,
                msg: "Preencha corretamente todos os campos. A imagem é obrigatória e a descrição deve ter até 500 caracteres."
            });
        }

        const projeto = new ProjetoConcluidoModel(0, imagem, descricao);
        const id = await projeto.cadastrar();

        if (id) {
            res.send({
                ok: true,
                msg: "Projeto cadastrado com sucesso!",
                projeto: { id, imagem, descricao }
            });
        } else {
            res.send({
                ok: false,
                msg: "Erro ao cadastrar projeto."
            });
        }
    }

        async excluir(req, res) {
        const { id } = req.body;

        if (!id) {
            return res.send({ ok: false, msg: "ID não informado" });
        }

        const projetoModel = new ProjetoConcluidoModel();
        
        // Obtemos o projeto antes de excluir, para pegar o nome da imagem
        const projetoExistente = await projetoModel.obter(id);

        if (!projetoExistente) {
            return res.status(404).send({ ok: false, msg: "Projeto não encontrado" });
        }

        const resultado = await projetoModel.excluir(id);

        if (resultado) {
            // Se houver imagem associada, tentar removê-la do disco
            if (projetoExistente.imagem) {
                const caminhoImagem = path.resolve("public", "uploads", "projetos", projetoExistente.imagem);

                if (fs.existsSync(caminhoImagem)) {
                    try {
                        fs.unlinkSync(caminhoImagem);
                    } catch (err) {
                        console.error("❌ Erro ao excluir imagem:", err);
                    }
                } else {
                    console.warn("⚠️ Imagem não encontrada no caminho:", caminhoImagem);
                }
            }

            res.send({ ok: true, msg: "Projeto excluído com sucesso." });
        } else {
            res.send({ ok: false, msg: "Erro ao excluir projeto!" });
        }
    }




    async editar(req, res) {
        const { id } = req.params;
        const { descricao } = req.body;
        const novaImagem = req.file?.filename;

        if (!id || !descricao || descricao.length > 500) {
            return res.status(400).send({
                ok: false,
                msg: "Dados inválidos para edição. A descrição deve ter até 500 caracteres."
            });
        }

        const projetoModel = new ProjetoConcluidoModel();
        const projetoExistente = await projetoModel.obter(id);

        if (!projetoExistente) {
            return res.status(404).send({ ok: false, msg: "Projeto não encontrado" });
        }

        // ⚠️ Caminho da imagem antiga
        if (novaImagem && projetoExistente.imagem) {
            const caminhoAntigo = path.resolve("public", "uploads", "projetos", projetoExistente.imagem);
            

            if (fs.existsSync(caminhoAntigo)) {
                try {
                    fs.unlinkSync(caminhoAntigo);
                } catch (err) {
                    console.error("❌ Erro ao excluir imagem antiga:", err);
                }
            } else {
                console.warn("⚠️ Imagem antiga não encontrada no caminho:", caminhoAntigo);
            }
        }

        const imagemFinal = novaImagem || projetoExistente.imagem;

        const projeto = new ProjetoConcluidoModel(id, imagemFinal, descricao);
        const resultado = await projeto.editar();

        if (resultado) {
            res.send({
                ok: true,
                msg: "Projeto editado com sucesso!",
                projeto: { id, imagem: imagemFinal, descricao }
            });
        } else {
            res.send({ ok: false, msg: "Erro ao editar projeto." });
        }
    }


}

module.exports = ProjetoConcluidoController;
