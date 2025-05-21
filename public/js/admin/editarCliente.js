document.addEventListener("DOMContentLoaded", () => {
    const modal = new bootstrap.Modal(document.getElementById("clienteModal"));
    const form = document.getElementById("formCliente");
    const modalTitulo = document.getElementById("modalClienteLabel");

    // Clique no botão editar cliente
    document.querySelectorAll(".btnEditarCliente").forEach(botao => {
        botao.addEventListener("click", () => {
            const cliente = JSON.parse(botao.getAttribute("data-cliente"));

            // Preenche os campos do formulário
            form.id.value = cliente.id;
            form.nome_completo.value = cliente.nome_completo;
            form.cpf_cnpj.value = cliente.cpf_cnpj;
            form.email.value = cliente.email;
            form.telefone.value = cliente.telefone;
            form.logradouro.value = cliente.logradouro;
            form.numero.value = cliente.numero;
            form.complemento.value = cliente.complemento;
            form.cidade.value = cliente.cidade;
            form.estado.value = cliente.estado;
            form.cep.value = cliente.cep;

            // Altera título do modal
            modalTitulo.textContent = "Editar Cliente";

            // Exibe o modal
            modal.show();
        });
    });

    // Clique no botão "Novo Cliente"
    document.getElementById("btnNovoCliente").addEventListener("click", () => {
        form.reset();
        form.id.value = "";
        modalTitulo.textContent = "Cadastro de Cliente";
    });
});
