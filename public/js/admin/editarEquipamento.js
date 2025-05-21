document.addEventListener("DOMContentLoaded", () => {
    const modal = new bootstrap.Modal(document.getElementById("equipamentoModal"));
    const form = document.getElementById("formEquipamento");
    const modalTitulo = document.getElementById("modalEquipamentoLabel");

    // Clique no botão editar equipamento
    document.querySelectorAll(".btnEditarEquipamento").forEach(botao => {
        botao.addEventListener("click", () => {
            // Preenche os campos do formulário com os dados do botão
            form.id.value = botao.getAttribute("data-id");
            form.nome.value = botao.getAttribute("data-nome");
            form.marca.value = botao.getAttribute("data-marca");
            form.quantidade.value = botao.getAttribute("data-quantidade");
            form.data_aquisicao.value = botao.getAttribute("data-data");
            form.valor.value = botao.getAttribute("data-valor");

            // Altera título do modal
            modalTitulo.textContent = "Editar Equipamento";

            // Exibe o modal
            modal.show();
        });
    });

    // Clique no botão "Novo Equipamento"
    document.getElementById("btnNovoEquipamento").addEventListener("click", () => {
        form.reset();
        form.id.value = "";
        modalTitulo.textContent = "Cadastro de Equipamento";
    });
});
