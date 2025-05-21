document.addEventListener("click", function (event) {
    const botao = event.target.closest(".btnExcluirEquipamento");
  
    if (botao) {
      const id = botao.getAttribute("data-id");
  
      Swal.fire({
        title: "Tem certeza?",
        text: "Esta ação não pode ser desfeita!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sim, excluir",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const resposta = await fetch("/admin/equipamentos", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id })
            });
  
            const resultado = await resposta.json();
  
            if (resultado.ok) {
              botao.closest("tr").remove(); // remove a linha da tabela dinamicamente
              Swal.fire("Excluído!", "Equipamento removido com sucesso.", "success");
            } else {
              Swal.fire("Erro", resultado.msg || "Erro ao excluir", "error");
            }
          } catch (err) {
            console.error("Erro ao excluir equipamento:", err);
            Swal.fire("Erro", "Não foi possível completar a requisição.", "error");
          }
        }
      });
    }
  });
  