const ProjetoConcluidoModel = require("../models/ProjetoConcluidoModel");

class HomeController {

    //método responsável por devolver o html
    homeView(req, res) {
        res.render('site/home', { layout: 'site/layout' });
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

    blogView(req, res) {
        res.render('site/blog', { layout: 'site/layout' });
    }

    portfolioView(req, res) {
        res.render('site/portfolio', { layout: 'site/layout' });
    }

}

//permite que a classe homeController seja importado
module.exports = HomeController;