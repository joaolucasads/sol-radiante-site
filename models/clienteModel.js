const Database = require("../utils/database");
const banco = new Database();

class ClienteModel {

    #id;
    #nomeCompleto;
    #cpfCnpj;
    #email;
    #telefone;
    #logradouro;
    #numero;
    #complemento;
    #cidade;
    #estado;
    #cep;

    // Getters e Setters
    get id() { return this.#id; }
    set id(id) { this.#id = id; }

    get nomeCompleto() { return this.#nomeCompleto; }
    set nomeCompleto(nomeCompleto) { this.#nomeCompleto = nomeCompleto; }

    get cpfCnpj() { return this.#cpfCnpj; }
    set cpfCnpj(cpfCnpj) { this.#cpfCnpj = cpfCnpj; }

    get email() { return this.#email; }
    set email(email) { this.#email = email; }

    get telefone() { return this.#telefone; }
    set telefone(telefone) { this.#telefone = telefone; }

    get logradouro() { return this.#logradouro; }
    set logradouro(logradouro) { this.#logradouro = logradouro; }

    get numero() { return this.#numero; }
    set numero(numero) { this.#numero = numero; }

    get complemento() { return this.#complemento; }
    set complemento(complemento) { this.#complemento = complemento; }

    get cidade() { return this.#cidade; }
    set cidade(cidade) { this.#cidade = cidade; }

    get estado() { return this.#estado; }
    set estado(estado) { this.#estado = estado; }

    get cep() { return this.#cep; }
    set cep(cep) { this.#cep = cep; }

    // Construtor
    constructor(id, nomeCompleto, cpfCnpj, email, telefone, logradouro, numero, complemento, cidade, estado, cep) {
        this.#id = id;
        this.#nomeCompleto = nomeCompleto;
        this.#cpfCnpj = cpfCnpj;
        this.#email = email;
        this.#telefone = telefone;
        this.#logradouro = logradouro;
        this.#numero = numero;
        this.#complemento = complemento;
        this.#cidade = cidade;
        this.#estado = estado;
        this.#cep = cep;
    }

    // Métodos
    async cadastrar() {
        let sql = `
            INSERT INTO clientes
            (nome_completo, cpf_cnpj, email, telefone, logradouro, numero, complemento, cidade, estado, cep)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        let valores = [
            this.#nomeCompleto, this.#cpfCnpj, this.#email, this.#telefone,
            this.#logradouro, this.#numero, this.#complemento,
            this.#cidade, this.#estado, this.#cep
        ];
        let resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId;
    }

    async listar() {
        let sql = "SELECT * FROM clientes";
        return await banco.ExecutaComando(sql);
    }

    async obter(id) {
        let sql = "SELECT * FROM clientes WHERE id = ?";
        let rows = await banco.ExecutaComando(sql, [id]);
        if (rows.length > 0) {
            let row = rows[0];
            return new ClienteModel(
                row.id, row.nome_completo, row.cpf_cnpj, row.email, row.telefone,
                row.logradouro, row.numero, row.complemento,
                row.cidade, row.estado, row.cep
            );
        }
        return null;
    }

    async excluir(id) {
        let sql = "DELETE FROM clientes WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }

    async editar() {
        let sql = `
            UPDATE clientes SET
                nome_completo = ?, cpf_cnpj = ?, email = ?, telefone = ?,
                logradouro = ?, numero = ?, complemento = ?,
                cidade = ?, estado = ?, cep = ?
            WHERE id = ?
        `;
        let valores = [
            this.#nomeCompleto, this.#cpfCnpj, this.#email, this.#telefone,
            this.#logradouro, this.#numero, this.#complemento,
            this.#cidade, this.#estado, this.#cep,
            this.#id
        ];
        return await banco.ExecutaComandoNonQuery(sql, valores);
    }

    async filtrar(campo, valor) {
        const camposPermitidos = {
            id: "id",
            nome: "nome_completo",
            email: "email",
            cpf: "cpf_cnpj",
            telefone: "telefone",
            cidade: "cidade"
        };
        

        const campoValido = camposPermitidos[campo];

        if (!campoValido) return [];

        let sql = `SELECT * FROM clientes WHERE ${campoValido} LIKE ?`;
        return await banco.ExecutaComando(sql, [`%${valor}%`]);
    }

}

module.exports = ClienteModel;
