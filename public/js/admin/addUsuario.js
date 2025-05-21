document.addEventListener("DOMContentLoaded", function () {
  const modalElement = document.getElementById("userModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const btnSalvar = document.getElementById("btnSalvar");
  const inputId = document.getElementById("usuarioId");

  const inputs = {
    nome: document.getElementById("nome"),
    email: document.getElementById("email"),
    senha: document.getElementById("senha"),
    perfil: document.getElementById("perfil"),
  };

  // Função para validar email (formato básico)
  function isValidEmail(email) {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return re.test(email);
  }

  // Função para validar senha:
  // Deve ter mais de 4 caracteres e conter pelo menos uma letra e um número
  function isValidPassword(senha) {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{5,}$/;
    return re.test(senha);
  }

  // Clique no botão de editar
  document.querySelectorAll(".btnEditar").forEach(btn => {
    btn.addEventListener("click", function () {
      inputId.value = btn.getAttribute("data-id");
      inputs.nome.value = btn.getAttribute("data-nome");
      inputs.email.value = btn.getAttribute("data-email");
      inputs.perfil.value = btn.getAttribute("data-perfil");
      inputs.senha.value = "";

      document.getElementById("modalLabel").innerText = "Editar Usuário";
      btnSalvar.innerText = "Salvar Alterações";

      modalInstance.show();
    });
  });

  // Clique no botão salvar (cadastrar ou editar)
  btnSalvar.addEventListener("click", function () {
    const id = inputId.value;
    const nome = inputs.nome.value.trim();
    const email = inputs.email.value.trim();
    const senha = inputs.senha.value.trim();
    const perfil = inputs.perfil.value;

    let erros = [];
    if (nome === "") erros.push("nome");
    if (email === "") erros.push("email");
    if (perfil === "0" || perfil === "") erros.push("perfil");

    if (erros.length > 0) {
      erros.forEach(campo => inputs[campo].style.borderColor = "red");
      Swal.fire("Erro", "Preencha todos os campos obrigatórios!", "error");
      return;
    }

    if (!isValidEmail(email)) {
      Swal.fire("Erro", "Email inválido!", "error");
      return;
    }

    if (!id) {
      if (senha === "" || !isValidPassword(senha)) {
        Swal.fire("Erro", "Senha inválida! Deve ter mais de 4 caracteres e conter letras e números.", "error");
        return;
      }
    } else {
      if (senha !== "" && !isValidPassword(senha)) {
        Swal.fire("Erro", "Senha inválida! Deve ter mais de 4 caracteres e conter letras e números.", "error");
        return;
      }
    }

    const payload = { nome, email, senha, perfil };
    const rota = id ? `/admin/usuarios/${id}` : "/admin/usuarios";
    const metodo = id ? "PUT" : "POST";

    fetch(rota, {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          Swal.fire("Sucesso", res.msg || (id ? "Usuário editado com sucesso!" : "Usuário cadastrado com sucesso!"), "success")
            .then(() => {
              modalInstance.hide();
              location.reload();
            });
        } else {
          Swal.fire("Erro", res.msg || "Erro ao salvar!", "error");
        }
      })
      .catch(err => {
        console.error("Erro:", err);
        Swal.fire("Erro", "Erro email ja cadastrado", "error");
      });
  });
});
