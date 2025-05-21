document.addEventListener("DOMContentLoaded", function () {
  // Máscara para o campo "valor"
  IMask(document.getElementById("valor"), {
    mask: Number,
    scale: 2,
    signed: false,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: '.',
    mapToRadix: [',']
  });

  const modalElement = document.getElementById("equipamentoModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const form = document.getElementById("formEquipamento");
  const modalTitulo = document.getElementById("modalEquipamentoLabel");
  const btnSalvar = document.getElementById("btnSalvarEquipamento");
  const inputId = document.getElementById("id");

  const inputs = {
    nome: document.getElementById("nome"),
    marca: document.getElementById("marca"),
    modelo: document.getElementById("modelo"),
    quantidade_estoque: document.getElementById("quantidade"),
    data_aquisicao: document.getElementById("data_aquisicao"),
    valor: document.getElementById("valor"),
  };

  // Botão NOVO equipamento
  document.getElementById("btnNovoEquipamento")?.addEventListener("click", () => {
    inputId.value = "";
    for (const campo in inputs) {
      inputs[campo].value = "";
    }
    modalTitulo.textContent = "Cadastro de Equipamento";
    btnSalvar.textContent = "Cadastrar";
    modalInstance.show();
  });

  // Botões EDITAR equipamento
  document.querySelectorAll(".btnEditarEquipamento").forEach(botao => {
    botao.addEventListener("click", () => {
      inputId.value = botao.getAttribute("data-id");
      inputs.nome.value = botao.getAttribute("data-nome");
      inputs.marca.value = botao.getAttribute("data-marca");
      inputs.modelo.value = botao.getAttribute("data-modelo");
      inputs.quantidade_estoque.value = botao.getAttribute("data-quantidade");
      inputs.data_aquisicao.value = botao.getAttribute("data-data");
      inputs.valor.value = botao.getAttribute("data-valor");

      modalTitulo.textContent = "Editar Equipamento";
      btnSalvar.textContent = "Salvar Alterações";
      modalInstance.show();
    });
  });

  // Botão SALVAR (criação ou edição)
  btnSalvar.addEventListener("click", function (event) {
    event.preventDefault();

    const id = inputId.value;
    const payload = {};

    for (const campo in inputs) {
      payload[campo] = inputs[campo].value.trim();
    }

    // Validações
    if (!payload.nome || !payload.marca || !payload.data_aquisicao || !payload.valor) {
      Swal.fire("Erro", "Preencha os campos obrigatórios: Nome, Marca, Data de Aquisição e Valor.", "error");
      return;
    }

    if (payload.quantidade_estoque === "") {
      payload.quantidade_estoque = "0";
    }
    let quantidade = Number(payload.quantidade_estoque);
    if (isNaN(quantidade) || quantidade < 0 || quantidade > 999) {
      Swal.fire("Erro", "A quantidade deve ser um número entre 0 e 999.", "error");
      return;
    }

    let dataAquisicao = new Date(payload.data_aquisicao);
    let anoAtual = new Date().getFullYear();
    if (isNaN(dataAquisicao.getTime()) || dataAquisicao.getFullYear() > anoAtual) {
      Swal.fire("Erro", "Data de aquisição inválida ou no futuro.", "error");
      return;
    }

    let valor = Number(payload.valor);
    if (isNaN(valor) || valor < 0 || valor > 999999) {
      Swal.fire("Erro", "O valor deve ser um número entre 0 e 999.999.", "error");
      return;
    }

    const rota = id ? `/admin/equipamentos/${id}` : "/admin/equipamentos";
    const metodo = id ? "PUT" : "POST";

    fetch(rota, {
      method: metodo,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(res => {
        if (res.ok) {
          Swal.fire("Sucesso", res.msg, "success").then(() => {
            modalInstance.hide();
            location.reload();
          });
        } else {
          Swal.fire("Erro", res.msg || "Erro ao salvar!", "error");
        }
      })
      .catch(err => {
        console.error("Erro:", err);
        Swal.fire("Erro", "Erro ao processar requisição!", "error");
      });
  });
});
