document.addEventListener("DOMContentLoaded", function () {
    // Configura a máscara para o campo "valor"
    IMask(document.getElementById("valor"), {
      mask: Number,
      scale: 2,                // 2 casas decimais
      signed: false,           // Apenas números positivos
      thousandsSeparator: '',  // Sem separador de milhares
      padFractionalZeros: true,
      normalizeZeros: true,
      radix: '.',              // Separador decimal é o ponto
      mapToRadix: [',']        // Permite também usar a vírgula
    });
    
    const modalElement = document.getElementById("equipamentoModal");
    const modalInstance = new bootstrap.Modal(modalElement);
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
  
    // Evento para editar
    document.querySelectorAll(".btnEditarEquipamento").forEach((btn) => {
      btn.addEventListener("click", function () {
        inputId.value = btn.getAttribute("data-id");
        inputs.nome.value = btn.getAttribute("data-nome");
        inputs.marca.value = btn.getAttribute("data-marca");
        inputs.modelo.value = btn.getAttribute("data-modelo");
        inputs.quantidade_estoque.value = btn.getAttribute("data-quantidade");
        inputs.data_aquisicao.value = btn.getAttribute("data-data");
        inputs.valor.value = btn.getAttribute("data-valor");
  
        document.getElementById("modalEquipamentoLabel").innerText = "Editar Equipamento";
        btnSalvar.innerText = "Salvar Alterações";
  
        modalInstance.show();
      });
    });
  
    // Evento para novo equipamento
    document.getElementById("btnNovoEquipamento")?.addEventListener("click", () => {
      // Limpa o campo de id e todos os inputs
      inputId.value = "";
      for (const campo in inputs) {
        inputs[campo].value = "";
      }
      document.getElementById("modalEquipamentoLabel").innerText = "Cadastro de Equipamento";
      btnSalvar.innerText = "Cadastrar";
      modalInstance.show();
    });
  
    // Salvar/Cadastrar
    btnSalvar.addEventListener("click", function (event) {
      event.preventDefault(); // Impede o comportamento padrão do form
      console.log("Botão salvar clicado!");
  
      const id = inputId.value;
      const payload = {};
  
      // Preenche o payload com valores sem espaços no início/fim
      for (const campo in inputs) {
        payload[campo] = inputs[campo].value.trim();
      }
  
      // Verifica campos obrigatórios: nome, marca, data e valor
      if (!payload.nome || !payload.marca || !payload.data_aquisicao || !payload.valor) {
        Swal.fire("Erro", "Preencha os campos obrigatórios: Nome, Marca, Data de Aquisição e Valor.", "error");
        return;
      }
  
      // Validação de quantidade:
      // Se estiver vazio, atribuímos 0; caso contrário, verificamos se é um número no intervalo de 0 a 999.
      if (payload.quantidade_estoque === "") {
        payload.quantidade_estoque = "0";
      } 
      let quantidade = Number(payload.quantidade_estoque);
      if (isNaN(quantidade) || quantidade < 0 || quantidade > 999) {
        Swal.fire("Erro", "A quantidade deve ser um número entre 0 e 999.", "error");
        return;
      }
  
      // Validação da data:
      // A data deve ser válida e o ano não pode ser maior que o atual.
      let dataAquisicao = new Date(payload.data_aquisicao);
      if (isNaN(dataAquisicao.getTime())) {
        Swal.fire("Erro", "Data de aquisição inválida.", "error");
        return;
      }
      let anoAtual = new Date().getFullYear();
      if (dataAquisicao.getFullYear() > anoAtual) {
        Swal.fire("Erro", "A data de aquisição não pode ser superior ao ano atual.", "error");
        return;
      }
  
      // Validação de valor:
      // Deve ser numérico e estar entre 0 e 999.999.
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
  