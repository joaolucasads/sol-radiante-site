const Database = require("../utils/database");

const banco = new Database();

class ContatoModel {
    #id;
    #nome;
    #telefone;
    #email;
    #estado;
    #cidade;
    #assunto;
    #mensagem;

    // Getters e Setters
    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get nome() { return this.#nome; }
    set nome(nome) { this.#nome = nome; }

    get telefone() { return this.#telefone; }
    set telefone(telefone) { this.#telefone = telefone; }

    get email() { return this.#email; }
    set email(email) { this.#email = email; }

    get estado() { return this.#estado; }
    set estado(estado) { this.#estado = estado; }

    get cidade() { return this.#cidade; }
    set cidade(cidade) { this.#cidade = cidade; }

    get assunto() { return this.#assunto; }
    set assunto(assunto) { this.#assunto = assunto; }

    get mensagem() { return this.#mensagem; }
    set mensagem(mensagem) { this.#mensagem = mensagem; }

    // Construtor
    constructor(id, nome, telefone, email, estado, cidade, assunto, mensagem) {
        this.#id = id;
        this.#nome = nome;
        this.#telefone = telefone;
        this.#email = email;
        this.#estado = estado;
        this.#cidade = cidade;
        this.#assunto = assunto;
        this.#mensagem = mensagem;
    }

    // Cadastrar novo contato
    async cadastrar() {
        const sql = `
            INSERT INTO contatos (nome, telefone, email, estado, cidade, assunto, mensagem)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const valores = [
            this.#nome,
            this.#telefone,
            this.#email,
            this.#estado,
            this.#cidade,
            this.#assunto,
            this.#mensagem
        ];

        const resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId;
    }

    // Listar todos os contatos
    async listar() {
        const sql = `
            SELECT * FROM contatos ORDER BY criado_em DESC
        `;
        return await banco.ExecutaComando(sql);
    }

    // Filtrar por campo
    async filtrar(campo, valor) {
        const camposPermitidos = {
            nome: "nome",
            email: "email",
            estado: "estado",
            cidade: "cidade",
            assunto: "assunto"
        };

        const campoValido = camposPermitidos[campo];
        if (!campoValido) return [];

        const sql = `SELECT * FROM contatos WHERE ${campoValido} LIKE ? ORDER BY criado_em DESC`;
        const valores = [`%${valor}%`];
        return await banco.ExecutaComando(sql, valores);
    }

    // Excluir
    async excluir(id) {
        const sql = "DELETE FROM contatos WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
}

module.exports = ContatoModel;
