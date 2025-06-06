document.querySelectorAll('.btnEditarOrcamento').forEach(botao => {
  botao.addEventListener('click', async function () {
    document.getElementById('modalOrcamentoLabel').innerText = 'Editar Orçamento';
    const id = this.dataset.id;

    try {
      const resposta = await fetch(`/admin/orcamentos/${id}`);
      const dados = await resposta.json();

      const orc = dados.orcamento;
      const equipamentos = dados.equipamentos;

      document.getElementById('orcamentoId').value = orc.id;

      // Cliente
      document.getElementById('cliente_id').value = orc.cliente_id;
      document.getElementById('telefone').value = orc.cliente_telefone || '';
      document.getElementById('cpf_cnpj').value = orc.cliente_cpf_cnpj || '';
      document.getElementById('email').value = orc.cliente_email || '';
      document.getElementById('logradouro').value = orc.cliente_logradouro || '';
      document.getElementById('numero').value = orc.cliente_numero || '';
      document.getElementById('complemento').value = orc.cliente_complemento || '';
      document.getElementById('cidade').value = orc.cliente_cidade || '';
      document.getElementById('estado').value = orc.cliente_estado || '';
      document.getElementById('cep').value = orc.cliente_cep || '';

      // Consumo
      document.getElementById('media_consumo').value = orc.media_consumo_kwh;
      document.getElementById('concessionaria').value = orc.concessionaria;
      document.getElementById('tipo_cliente').value = orc.tipo_cliente;

      // Sistema
      document.getElementById('tipo_sistema').value = orc.tipo_sistema;
      document.getElementById('capacidade_kwp').value = orc.capacidade_kwp;

      const container = document.getElementById('equipamentosContainer');
      container.innerHTML = '';

      equipamentos.forEach((eq, index) => {
        const equipamentoHtml = `
          <div class="row mb-2 equipamento-item">
            <input type="hidden" name="equipamentos[${index}].equipamentoId" value="${eq.id}">
            <div class="col-md-3">Equipamento
              <input type="text" class="form-control" name="equipamentos[${index}].nome" value="${eq.nome}" disabled>
            </div>
            <div class="col-md-2">Marca
              <input type="text" class="form-control" name="equipamentos[${index}].marca" value="${eq.marca}" disabled>
            </div>
            <div class="col-md-2">Modelo
              <input type="text" class="form-control" name="equipamentos[${index}].modelo" value="${eq.modelo}" disabled>
            </div>
            <div class="col-md-2">Quantidade
              <input type="number" class="form-control" name="equipamentos[${index}].quantidade" value="${eq.quantidade}" required>
            </div>
            <div class="col-md-2">Valor Unitario
              <input type="number" step="0.01" class="form-control" name="equipamentos[${index}].valorUnitario" value="${eq.valor_unitario}" disabled>
            </div>
            <div class="col-md-1 text-end"><br>
              <button type="button" class="btn btn-danger btnRemoverEquipamento">&times;</button>
            </div>
          </div>
        `;
        container.insertAdjacentHTML('beforeend', equipamentoHtml);
      });

      container.addEventListener('click', function (e) {
        if (e.target.classList.contains('btnRemoverEquipamento')) {
          const item = e.target.closest('.equipamento-item');
          if (item) {
            item.remove();
            reindexarEquipamentos();
          }
        }
      });

      function reindexarEquipamentos() {
        const items = container.querySelectorAll('.equipamento-item');
        items.forEach((item, index) => {
          item.querySelectorAll('input').forEach(input => {
            const name = input.name;
            const campo = name.substring(name.indexOf('].') + 2);
            input.name = `equipamentos[${index}].${campo}`;
          });
        });
      }

      // Financeiro
      document.getElementById('valor_total').value = orc.valor_total;
      document.getElementById('valor_total_desconto').value = orc.valor_total_desconto;
      document.getElementById('desconto').value = orc.desconto;
      document.getElementById('condicoes_pagamento').value = orc.condicoes_pagamento;
      document.getElementById('economia_estimada').value = orc.economia_estimativa;
      document.querySelector(`#servico_id > option[value="${orc.servico_id}"]`).setAttribute('selected', "true");
      document.getElementById('status').value = orc.status;

      // Salva status original para futura comparação
      document.getElementById('status').dataset.originalStatus = orc.status;

      const modal = new bootstrap.Modal(document.getElementById('orcamentoModal'));
      modal.show();

    } catch (err) {
      Swal.fire('Erro!', 'Não foi possível carregar o orçamento.', 'error');
    }
  });
});

document.getElementById('formOrcamento').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('orcamentoId').value;
  if (!id) return;

  const form = e.target;
  const dados = Object.fromEntries(new FormData(form).entries());

  const statusNovo = document.getElementById('status').value;
  const statusOriginal = document.getElementById('status').dataset.originalStatus;

  const deveGerarOS = statusNovo === "aprovado" && statusOriginal !== "aprovado";

  try {
    const resposta = await fetch(`/admin/orcamentos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });

    if (!resposta.ok) {
      const erro = await resposta.json();
      throw new Error(erro.msg || erro.erro || 'Erro ao atualizar orçamento');
    }

    if (deveGerarOS) {
      try {
        const dataAtual = new Date().toISOString().split("T")[0];
        const corpo = {
          orcamento_id: id,
          status: "pendente",
          data_criacao: dataAtual,
          data_conclusao: null,
          observacoes: ""
        };

        const respostaOS = await fetch('/admin/instalacoes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(corpo)
        });

        if (!respostaOS.ok) {
          const erro = await respostaOS.json();
          throw new Error(erro.msg || erro.erro || 'Erro ao criar Ordem de Serviço');
        }

      } catch (err) {
        console.error("Erro ao gerar OS:", err.message);
        Swal.fire("Erro!", "Erro ao gerar Ordem de Serviço: " + err.message, "error");
        return;
      }
    }

  } catch (err) {
    Swal.fire('Erro!', err.message, 'error');
  }
});
