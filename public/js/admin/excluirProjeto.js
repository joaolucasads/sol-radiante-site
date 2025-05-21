document.querySelectorAll(".btnExcluirProjeto").forEach(botao => {
    botao.addEventListener("click", () => {
        const id = botao.dataset.id;

        Swal.fire({
            title: "Confirma a exclusão?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir!",
            cancelButtonText: "Cancelar"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch("/admin/projetos", {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ id })
                    });

                    const result = await response.json();

                    if (result.ok) {
                        Swal.fire("Excluído", "Projeto excluído com sucesso", "success").then(() => {
                            window.location.reload();
                        });
                    } else {
                        Swal.fire("Erro", result.msg || "Erro ao excluir", "error");
                    }
                } catch (err) {
                    Swal.fire("Erro", "Erro na requisição", "error");
                    console.error(err);
                }
            }
        });
    });
});
