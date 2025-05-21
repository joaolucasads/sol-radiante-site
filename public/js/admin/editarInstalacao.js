document.querySelectorAll('.btnEditarInstalacao').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.getAttribute('data-id');
    document.getElementById('editInstalacaoId').value = id;
    // Abre o modal de edição
    const modal = new bootstrap.Modal(document.getElementById('editarInstalacaoModal'));
    modal.show();
  });
});

document.getElementById('formEditarInstalacao').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('editInstalacaoId').value;
  const status = document.getElementById('editStatus').value;
  const observacoes = document.getElementById('editObservacoes').value;

  if (!status) {
    return Swal.fire("Atenção", "Por favor, selecione um status.", "warning");
  }

  try {
    const resposta = await fetch(`/admin/instalacoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, observacoes })
    });

    const resultado = await resposta.json();

    if (resultado.ok) {
      Swal.fire("Sucesso", resultado.msg, "success").then(() => location.reload());
    } else {
      Swal.fire("Erro", resultado.msg, "error");
    }
  } catch (err) {
    Swal.fire("Erro", "Erro ao atualizar instalação.", "error");
  }
});
