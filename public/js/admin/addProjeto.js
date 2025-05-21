document.getElementById("btnNovoProjeto").addEventListener("click", () => {
    const form = document.getElementById("formProjeto");
    form.reset();
    document.getElementById("idProjeto").value = "";
    document.getElementById("imagemPreview").src = ""; // Remove preview da imagem antiga
    document.getElementById("imagemPreview").style.display = "none";

    const modal = new bootstrap.Modal(document.getElementById("projetoModal"));
    modal.show();
});

document.getElementById("formProjeto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    const id = formData.get("id");

    const url = id
        ? `/admin/projetos/${id}`
        : "/admin/projetos";

    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            body: formData
        });

        const result = await response.json();

        if (result.ok) {
            Swal.fire("Sucesso", result.msg, "success").then(() => {
                window.location.reload();
            });
        } else {
            Swal.fire("Erro", result.msg || "Erro ao salvar projeto", "error");
        }
    } catch (err) {
        Swal.fire("Erro", "Erro na requisição", "error");
        console.error(err);
    }
});

// Preview ao escolher nova imagem
document.getElementById("imagem").addEventListener("change", function () {
    const file = this.files[0];
    if (file) {
        const preview = document.getElementById("imagemPreview");
        preview.src = URL.createObjectURL(file);
        preview.style.display = "block";
    }
});
