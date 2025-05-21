document.addEventListener("DOMContentLoaded", () => {
    filtrarUsuarios();
});

function limparFormulario() {
    document.getElementById("usuarioId").value = "";
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
    document.getElementById("perfil").value = "Operacional";
    document.getElementById("senha").value = "";
}

function editarUsuario(id, nome, email, perfil) {
    document.getElementById("usuarioId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
    document.getElementById("perfil").value = perfil;
    document.getElementById("senha").value = "";
}

function salvarUsuario() {
    const id = document.getElementById("usuarioId").value;
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const perfil = document.getElementById("perfil").value;
    const senha = document.getElementById("senha").value;

    const usuario = { id, nome, email, perfil, senha };

    if (id) {
        console.log("Atualizando usuário:", usuario);
        alert("Usuário atualizado com sucesso!");
    } else {
        console.log("Cadastrando novo usuário:", usuario);
        alert("Usuário cadastrado com sucesso!");
    }

    document.getElementById("usuarioModal").querySelector(".btn-close").click();
}

function excluirUsuario(id) {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
        console.log("Excluindo usuário ID:", id);
        alert("Usuário excluído com sucesso!");
    }
}

function filtrarUsuarios() {
    let filtro = document.getElementById("filtroNome").value.toLowerCase();
    let linhas = document.getElementById("listaUsuarios").getElementsByTagName("tr");

    for (let i = 0; i < linhas.length; i++) {
        let nome = linhas[i].getElementsByTagName("td")[0].textContent.toLowerCase();
        if (nome.includes(filtro)) {
            linhas[i].style.display = "";
        } else {
            linhas[i].style.display = "none";
        }
    }
}
