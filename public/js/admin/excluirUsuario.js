document.addEventListener("click", function (event) {
    const botao = event.target.closest(".btnExcluir");

    if (botao) {
        const id = botao.getAttribute("data-id");

        Swal.fire({
            title: 'Tem certeza?',
            text: "Essa ação não poderá ser desfeita!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch("/admin/usuarios", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ id })
                })
                .then(res => res.json())
                .then(res => {
                    if (res.ok) {
                        botao.closest("tr").remove();
                        Swal.fire({
                            icon: 'success',
                            title: 'Usuário excluído!',
                            showConfirmButton: false,
                            timer: 2000
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Erro ao excluir',
                            text: res.msg || "Erro desconhecido."
                        });
                    }
                })
                .catch(err => {
                    console.error("Erro ao excluir:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Erro de rede',
                        text: 'Não foi possível completar a requisição.'
                    });
                });
            }
        });
    }
});