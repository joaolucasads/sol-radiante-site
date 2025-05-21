document.querySelectorAll(".btnEditarProjeto").forEach(botao => {
    botao.addEventListener("click", () => {
        const id = botao.dataset.id;
        const descricao = botao.dataset.descricao;
        const imagem = botao.dataset.imagem;

        document.getElementById("idProjeto").value = id;
        document.getElementById("imagemAtual").value = imagem;
        document.getElementById("descricao").value = descricao;

        const preview = document.getElementById("imagemPreview");
        preview.src = `/uploads/projetos/${imagem}`;
        preview.style.display = "block";

        const modal = new bootstrap.Modal(document.getElementById("projetoModal"));
        modal.show();
    });
});
