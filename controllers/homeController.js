const ProjetoConcluidoModel = require("../models/ProjetoConcluidoModel");

class HomeController {

    //método responsável por devolver o html
    async homeView(req, res) {
        let projetos = new ProjetoConcluidoModel();
        const listaProjetos = await projetos.listar();
        res.render('site/home', { layout: 'site/layout', listaProjetos: listaProjetos });
        
    }


}

//permite que a classe homeController seja importado
module.exports = HomeController;