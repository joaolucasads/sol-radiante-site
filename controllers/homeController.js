const ProjetoConcluidoModel = require("../models/ProjetoConcluidoModel");

class HomeController {

    //método responsável por devolver o html
    async homeView(req, res) {
        let projetos = new ProjetoConcluidoModel();
        const listaProjetos = await projetos.listar();
        res.render('site/home', { layout: 'site/layout', listaProjetos: listaProjetos });
        
    }

    contatoView(req, res) {
        res.render('site/contato', { layout: 'site/layout' });
    }

    sobreView(req, res) {
        res.render('site/sobre', { layout: 'site/layout' });
    }

    async servicosView(req, res) {
        let projetos = new ProjetoConcluidoModel();
        const listaProjetos = await projetos.listar();
        
        res.render('site/servicos', { layout: 'site/layout', listaProjetos: listaProjetos });
    }


    portfolioView(req, res) {
        res.render('site/portfolio', { layout: 'site/layout' });
    }

}

//permite que a classe homeController seja importado
module.exports = HomeController;