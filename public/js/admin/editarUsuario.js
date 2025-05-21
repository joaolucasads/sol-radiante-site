document.addEventListener("DOMContentLoaded", () => {
    const btnSalvar = document.getElementById("btnSalvar");
    const modalTitulo = document.getElementById("modalLabel");
    const modal = new bootstrap.Modal(document.getElementById("userModal"));
    modal.hide();
    // Quando clicar no botão editar
    document.querySelectorAll(".btnEditar").forEach(botao => {
      botao.addEventListener("click", () => {
        const id = botao.getAttribute("data-id");
        const nome = botao.getAttribute("data-nome");
        const email = botao.getAttribute("data-email");
        const perfil = botao.getAttribute("data-perfil");
  
        // Preenche os campos
        document.getElementById("usuarioId").value = id;
        document.getElementById("nome").value = nome;
        document.getElementById("email").value = email;
        document.getElementById("perfil").value = perfil;
        document.getElementById("senha").value = "";
  
        // Muda o título
        modalTitulo.textContent = "Editar Usuário";
  
        // Abre o modal
        modal.show();
      });
    });
  
    // Clique em Salvar (cadastrar ou editar)
    btnSalvar.addEventListener("click", async () => {
      const id = document.getElementById("usuarioId").value;
      const nome = document.getElementById("nome").value;
      const email = document.getElementById("email").value;
      const perfil = document.getElementById("perfil").value;
      const senha = document.getElementById("senha").value;
  
      if (!nome || !email || !senha || perfil === "0") {
        return Swal.fire("Atenção", "Preencha todos os campos!", "warning");
      }
  
      const dados = {
        id,
        nome,
        email,
        senha,
        perfil
      };
  
    
        const response = await fetch("/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados)
        });
  
        const resultado = await response.json();
  
        if (resultado.ok) {
          Swal.fire("Sucesso", resultado.msg, "success").then(() => {
            location.reload();
          });
        } else {
          Swal.fire("Erro", resultado.msg, "error");
        }
      
    });
  
    // Botão Novo Usuário limpa o modal
    document.getElementById("btnNovoUsuario").addEventListener("click", () => {
      document.getElementById("usuarioId").value = "";
      document.getElementById("nome").value = "";
      document.getElementById("email").value = "";
      document.getElementById("perfil").selectedIndex = 0;
      document.getElementById("senha").value = "";
  
      modalTitulo.textContent = "Cadastro de Usuário";
    });
  });
  