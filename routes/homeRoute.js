const express = require('express');
const HomeController = require('../controllers/homeController');

const router = express.Router();
let ctrl = new HomeController();
router.get("/", ctrl.homeView);
router.get("/contato", ctrl.contatoView);
router.get("/sobre", ctrl.sobreView);
router.get("/servicos", ctrl.servicosView);
router.get("/blog", ctrl.blogView);
router.get("/portfolio", ctrl.portfolioView);

module.exports = router;