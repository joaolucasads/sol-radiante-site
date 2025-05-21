document.querySelectorAll('.btnExcluirInstalacao').forEach(btn => {
  btn.addEventListener('click', async () => {
    const id = btn.getAttribute('data-id');

    const confirmacao = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não poderá ser desfeita!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    });

    if (confirmacao.isConfirmed) {
      try {
        const resposta = await fetch(`/admin/instalacoes/${id}`, {
          method: 'DELETE'
        });

        const resultado = await resposta.json();

        if (resultado.ok) {
          Swal.fire("Excluído!", resultado.msg, "success").then(() => location.reload());
        } else {
          Swal.fire("Erro", resultado.msg, "error");
        }
      } catch (err) {
        Swal.fire("Erro", "Erro ao excluir instalação.", "error");
      }
    }
  });
});
