const Database = require("../utils/database");
const banco = new Database();

class RecuperacaoSenhaModel {
    #id;
    #usuarioId;
    #token;
    #expiraEm;

    get id() {
        return this.#id;
    }
    set id(id) {
        this.#id = id;
    }

    get usuarioId() {
        return this.#usuarioId;
    }
    set usuarioId(usuarioId) {
        this.#usuarioId = usuarioId;
    }

    get token() {
        return this.#token;
    }
    set token(token) {
        this.#token = token;
    }

    get expiraEm() {
        return this.#expiraEm;
    }
    set expiraEm(expiraEm) {
        this.#expiraEm = expiraEm;
    }

    constructor(id, usuarioId, token, expiraEm) {
        this.#id = id;
        this.#usuarioId = usuarioId;
        this.#token = token;
        this.#expiraEm = expiraEm;
    }

    async cadastrar() {
        const sql = `
            INSERT INTO senha_reset_tokens (usuarioId, token, expiresAt)
            VALUES (?, ?, ?)
        `;
        const valores = [this.#usuarioId, this.#token, this.#expiraEm];
        const result = await banco.ExecutaComando(sql, valores);
        return result.insertId;
    }

    async obterPorToken(token) {
        const sql = `
            SELECT * FROM senha_reset_tokens WHERE token = ?;
        `;
        const rows = await banco.ExecutaComando(sql, [token]);

        if (rows.length > 0) {
            const r = rows[0];
            return new RecuperacaoSenhaModel(r.id, r.usuarioId, r.token, r.expiraEm);
        }

        return null;
    }

    async excluirToken(token) {
        const sql = "DELETE FROM senha_reset_tokens WHERE token = ?";
        await banco.ExecutaComandoNonQuery(sql, [token]);
    }

    async excluirPorUsuarioId(usuarioId) {
        const sql = "DELETE FROM senha_reset_tokens WHERE usuarioId = ?";
        return await banco.ExecutaComandoNonQuery(sql, [usuarioId]);
    }
}

module.exports = RecuperacaoSenhaModel;
