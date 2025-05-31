document.addEventListener('DOMContentLoaded', () => {
    const modal = new bootstrap.Modal(document.getElementById('orcamentoModal'));
    const form = document.getElementById('formOrcamento');
    const btnNovo = document.getElementById('btnNovoOrcamento');
    const tabela = document.getElementById('tabelaOrcamentos');

    document.getElementById('modalOrcamentoLabel').innerText = 'Cadastrar Orçamento';
    // Abrir modal para novo
    btnNovo.addEventListener('click', () => {
        form.reset();
        document.getElementById('orcamentoId').value = '';
        resetEquipamentos();
        modal.show();
    });

    function resetEquipamentos() {
        const equipamentosContainer = document.getElementById('equipamentosContainer');
        equipamentosContainer.innerHTML = '';
    }


    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Captura dados principais do formulário
        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());
        const id = dados.id;

        // Validações principais
        if (!dados.cliente_id || isNaN(dados.media_consumo) || isNaN(dados.valor_total)) {
            Swal.fire('Erro!', 'Todos os campos obrigatórios devem ser preenchidos corretamente.', 'error');
            return;
        }

        if(!dados.condicoes_pagamento){
            Swal.fire('Erro!', 'O campo "Condições de pagamento" deve ser preenchido.', 'error');
            return;
        }

        if (dados.media_consumo < 0) {
            Swal.fire('Erro!', 'O campo "Média de Consumo" deve ser maior que zero.', 'error');
            return;
        }
        if (dados.capacidade_kwp < 0) {
            Swal.fire('Erro!', 'O campo "Capacidade (kWp)" deve ser maior que zero.', 'error');
            return;
        }
        if (dados.economia_estimada < 0) {
            Swal.fire('Erro!', 'O campo "Economia Estimada" deve ser maior que zero.', 'error');
            return;
        }

        if (dados.valor_total < 0 || dados.desconto < 0) {
            Swal.fire('Erro!', 'Valor Total, Capacidade (kWp) e Desconto não podem ser negativos.', 'error');
            return;
        }

        if(dados.valor_total_desconto < 0){
            Swal.fire('Erro!', 'Valor total com Desconto não pode ser negativo!')
        }

        // Coletar equipamentos manualmente
        const equipamentos = [];
        document.querySelectorAll('.row.equipamento-item').forEach(row => {
            const equipamento = {
                equipamentoId: row.querySelector('[name$=".equipamentoId"]').value,
                quantidade: parseInt(row.querySelector('[name$=".quantidade"]').value),
                valorUnitario: parseFloat(row.querySelector('[name$=".valorUnitario"]').value)
            };
            equipamentos.push(equipamento);
        });


        dados.equipamentos = equipamentos;


        // Envia para backend
        const url = id ? `/admin/orcamentos/${id}` : '/admin/orcamentos';
        const metodo = id ? 'PUT' : 'POST';

        try {
            const resposta = await fetch(url, {
                method: metodo,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                throw new Error(erro.msg || erro.erro || 'Erro ao salvar orçamento');
            }

            Swal.fire('Sucesso!', 'Orçamento salvo com sucesso.', 'success')
                .then(() => window.location.reload());

        } catch (err) {
            Swal.fire('Erro!', err.message, 'error');
        }
    });


    document.querySelectorAll('.btnExcluirOrcamento').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.id;

            Swal.fire({
                title: 'Tem certeza?',
                text: 'Essa ação não pode ser desfeita.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, excluir!',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await fetch(`/admin/orcamentos/${id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Erro ao excluir');

                        Swal.fire('Excluído!', 'Orçamento removido.', 'success')
                            .then(() => window.location.reload());
                    } catch (err) {
                        Swal.fire('Erro!', err.message, 'error');
                    }
                }
            });
        });
    });
});
