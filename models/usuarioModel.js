const Database = require("../utils/database");

const banco = new Database();

class UsuarioModel {

    #usuarioId;
    #usuarioNome;
    #usuarioEmail;
    #usuarioSenha;
    #perfilId;
    //implementar getter e setter
    get usuarioId() {
        return this.#usuarioId;
    }
    set usuarioId(usuarioId) {
        this.#usuarioId = usuarioId
    }
    get usuarioNome() {
        return this.#usuarioNome;
    }
    set usuarioNome(usuarioNome) {
        this.#usuarioNome = usuarioNome;
    }

    get usuarioSenha() {
        return this.#usuarioSenha;
    }

    set usuarioSenha(usuarioSenha) {
        this.#usuarioSenha = usuarioSenha;
    }
    get perfilId() {
        return this.#perfilId;
    }

    set perfilId(perfilId){
        this.#perfilId = perfilId;
    }

    get usuarioEmail() {
        return this.#usuarioEmail;
    }

    set usuarioEmail(usuarioEmail){
        this.#usuarioEmail = usuarioEmail;
    }


    //implementar construtor
    constructor(usuarioId, usuarioNome, usuarioSenha, perfilId, usuarioEmail) {
        this.#usuarioId = usuarioId;
        this.#usuarioNome = usuarioNome;
        this.#usuarioSenha = usuarioSenha;
        this.#perfilId = perfilId;
        this.#usuarioEmail = usuarioEmail;
    }

    async obterPorUsuarioSenha(nome, senha) {
        let sql = "select * from usuarios where nome = ? and senha = ?";

        let valores = [nome, senha];

        let rows = await banco.ExecutaComando(sql, valores);

        if(rows.length > 0) {
            let row = rows[0];
            return new UsuarioModel(row["id"], row["nome"], row["senha"], row["perfil_id"], row["email"]);

        }

        return null;
    }

    async obter(id) {
        let sql = "SELECT * FROM usuarios WHERE id = ?";
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);
    
        if(rows.length > 0) {
            let row = rows[0];
            return new UsuarioModel(row["id"], row["nome"], row["senha"], row["perfil_id"], row["email"]);
        }
    
        return null;
    }

    async obterPorEmail(email) {
        let sql = "SELECT * FROM usuarios WHERE email = ?";
        let valores = [email];
        let rows = await banco.ExecutaComando(sql, valores);
    
        if(rows.length > 0) {
            let row = rows[0];
            return new UsuarioModel(row["id"], row["nome"], row["senha"], row["perfil_id"], row["email"]);
        }
    
        return null;
    }
    
    
    async cadastrar() {
        let sql = "insert into usuarios(nome, email, senha, perfil_id) values(?, ?, ?, ?)";
        let valores = [this.#usuarioNome, this.#usuarioEmail, this.#usuarioSenha, this.#perfilId];
        
        const resultado = await banco.ExecutaComando(sql, valores);
        return resultado.insertId; // ← Retorna o ID gerado
    }
    
    
    async listar() {
        let sql = `
            SELECT u.id, u.nome, u.email, u.perfil_id, p.nome AS perfil
            FROM usuarios u
            JOIN perfis p ON u.perfil_id = p.id
        `;
    
        let rows = await banco.ExecutaComando(sql);
        return rows;
    }
    
    async excluir(id) {
        let sql = "DELETE FROM usuarios WHERE id = ?";
        return await banco.ExecutaComandoNonQuery(sql, [id]);
    }
    
    async editar({ id, nome, email, senha, perfil }) {
        let sql = `
            UPDATE usuarios 
            SET email = ?, nome = ?, senha = ?, perfil_id = ?
            WHERE id = ?
        `;
    
        let valores = [email, nome, senha, perfil, id];
        let result = await banco.ExecutaComandoNonQuery(sql, valores);
        return result;
    } 

    async filtrar(campo, valor) {
        // Lista de campos válidos para filtro
        const camposPermitidos = {
            id: "u.id",
            nome: "u.nome",
            email: "u.email",
            perfil: "p.nome"
        };
    
        const campoValido = camposPermitidos[campo];
    
        if (!campoValido) {
            return []; // Se o campo não for permitido, retorna lista vazia
        }
    
        let sql = `
            SELECT u.id, u.nome, u.email, u.perfil_id, p.nome AS perfil
            FROM usuarios u
            JOIN perfis p ON u.perfil_id = p.id
            WHERE ${campoValido} LIKE ?
        `;
    
        const valores = [`%${valor}%`];
        return await banco.ExecutaComando(sql, valores);
    }
    
    toJSON() {
        return {
            id: this.#usuarioId,
            nome: this.#usuarioNome,
            email: this.#usuarioEmail,
            perfilId: this.#perfilId
        };
    }

    
}

module.exports = UsuarioModel;