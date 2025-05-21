const express = require('express');
const adminController = require('../controllers/adminController');
const AuthMiddleware = require('../middlewares/authMiddleware');
const clienteController = require("../controllers/clienteController");
const EquipamentoController = require('../controllers/equipamentoController');
const usuarioController = require('../controllers/usuarioController');
const ProjetoConcluidoController = require('../controllers/ProjetoConcluidoController');
const InstalacaoController = require('../controllers/instalacaoController')
const ContatoController = require('../controllers/contatoController');

const multer = require('multer');
const path = require('path');
const OrcamentoController = require('../controllers/orcamentoController');

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/projetos'); // garanta que esse diretório exista
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos JPG ou PNG são permitidos!'));
        }
    }
});

const router = express.Router();    
let ctrl = new adminController();
let auth = new AuthMiddleware();

// Login
router.get("/", ctrl.loginView);
router.post("/validar", ctrl.login);
router.get("/login", (req, res) => {
  res.clearCookie("usuarioLogado"); // ou req.session.destroy() se estiver usando sessions
  res.redirect("/admin/login");
});


// Usuários
let ctrlUsu = new usuarioController();
router.get("/usuarios", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlUsu.usuarioView);
router.post("/usuarios", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlUsu.cadastrar);
router.put("/usuarios/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlUsu.editar);
router.delete("/usuarios", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlUsu.excluir);

// Contatos
let ctrlCont = new ContatoController();
router.get("/contatos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCont.contatoView);
router.post("/contatos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCont.cadastrar);
router.delete("/contatos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCont.excluir);

// Clientes
let ctrlCli = new clienteController();
router.get("/clientes", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCli.clienteView);
router.post("/clientes", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCli.cadastrar);
router.put("/clientes/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCli.editar);
router.delete("/clientes", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlCli.excluir);

// Equipamentos
let ctrlEqp = new EquipamentoController();
router.get("/equipamentos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlEqp.equipamentoView);
router.post("/equipamentos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlEqp.cadastrar);
router.put("/equipamentos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlEqp.editar);
router.delete("/equipamentos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlEqp.excluir);

// orcamentos
let ctrlOrc = new OrcamentoController();
router.get("/orcamentos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlOrc.orcamentoView);
router.get("/orcamentos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlOrc.buscarPorId);
router.post("/orcamentos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlOrc.cadastrar);
router.put("/orcamentos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlOrc.atualizar);
router.delete("/orcamentos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlOrc.excluir);

// Instalações
let ctrlInst = new InstalacaoController();
router.post("/instalacoes", auth.verificarUsuarioLogado, ctrlInst.gerarInstalacao);
router.get("/instalacoes", auth.verificarUsuarioLogado, ctrlInst.instalacoesView);
router.get("/instalacoes/:id", auth.verificarUsuarioLogado, ctrlInst.instalacaoPorId);
router.put("/instalacoes/:id", auth.verificarUsuarioLogado, ctrlInst.editarInstalacao);
router.delete("/instalacoes/:id", auth.verificarUsuarioLogado, ctrlInst.excluirInstalacao);


// Projetos Concluídos
let ctrlProj = new ProjetoConcluidoController();
router.get("/projetos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlProj.projetosView);
router.post("/projetos", auth.verificarUsuarioLogado, auth.apenasAdmin, upload.single("imagem"), ctrlProj.cadastrar);
router.put("/projetos/:id", auth.verificarUsuarioLogado, auth.apenasAdmin, upload.single("imagem"), ctrlProj.editar);
router.delete("/projetos", auth.verificarUsuarioLogado, auth.apenasAdmin, ctrlProj.excluir);

// Tela principal protegida
router.get("/inicio", auth.verificarUsuarioLogado, ctrl.adminView);

module.exports = router;
