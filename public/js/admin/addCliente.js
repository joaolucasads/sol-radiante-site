document.addEventListener("DOMContentLoaded", function () {
  // Configura as máscaras utilizando a biblioteca IMask

  // Máscara para Telefone: aceita (00) 00000-0000; se preferir outro padrão, ajuste aqui
  IMask(document.getElementById("telefone"), {
    mask: '(00) 00000-0000'
  });

  // Máscara para CPF/CNPJ: máscara dinâmica, dependendo do comprimento dos dígitos
  IMask(document.getElementById("cpf_cnpj"), {
    mask: [
      { mask: '000.000.000-00', lazy: false },      // CPF
      { mask: '00.000.000/0000-00', lazy: false }     // CNPJ
    ]
  });

  // Máscara para CEP: 00000-000
  IMask(document.getElementById("cep"), {
    mask: '00000-000'
  });

  const modalElement = document.getElementById("clienteModal");
  const modalInstance = new bootstrap.Modal(modalElement);
  const btnSalvar = document.getElementById("btnSalvarCliente");
  const inputId = document.getElementById("id");

  const inputs = {
    nome_completo: document.getElementById("nome"),
    cpf_cnpj: document.getElementById("cpf_cnpj"),
    email: document.getElementById("email"),
    telefone: document.getElementById("telefone"),
    logradouro: document.getElementById("logradouro"),
    numero: document.getElementById("numero"),
    complemento: document.getElementById("complemento"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado"),
    cep: document.getElementById("cep"),
  };

  // --- Funções de Validação ---

  // Valida email
  function isValidEmail(email) {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return re.test(email);
  }

  // Valida telefone (formatos: (XX)XXXXX-XXXX ou (XX)XXXX-XXXX)
  function isValidTelefone(telefone) {
    const re = /^\(?\d{2}\)?[\s-]?\d{4,5}-?\d{4}$/;
    return re.test(telefone);
  }

  // Validação de CPF
  function isValidCPF(cpf) {
    cpf = cpf.replace(/\D/g, "");
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf.charAt(9))) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf.charAt(10));
  }

  // Validação de CNPJ
  function isValidCNPJ(cnpj) {
    cnpj = cnpj.replace(/\D/g, "");
    if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    let length = cnpj.length - 2;
    let numbers = cnpj.substring(0, length);
    let digits = cnpj.substring(length);
    let sum = 0;
    let pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(0)) return false;
    length = length + 1;
    numbers = cnpj.substring(0, length);
    sum = 0;
    pos = length - 7;
    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result != digits.charAt(1)) return false;
    return true;
  }

  // Valida CPF ou CNPJ (decide com base no número de dígitos)
  function isValidCpfCnpj(value) {
    let cleaned = value.replace(/\D/g, "");
    if (cleaned.length === 11) return isValidCPF(cleaned);
    if (cleaned.length === 14) return isValidCNPJ(cleaned);
    return false;
  }

  // Valida número da casa: não pode ser -1 e deve ser um número >= 0
  function isValidNumero(numero) {
    let num = Number(numero);
    return !isNaN(num) && num >= 0;
  }

  // Valida CEP: deve ter 8 dígitos (ignorando caracteres não numéricos)
  function isValidCEP(cep) {
    let cleaned = cep.replace(/\D/g, "");
    return cleaned.length === 8;
  }

  // --- Eventos do Modal ---

  // Evento para editar cliente
  document.querySelectorAll(".btn-editar-cliente").forEach((btn) => {
    btn.addEventListener("click", function () {
      const cliente = JSON.parse(btn.getAttribute("data-cliente"));
      inputId.value = cliente.id;

      for (const campo in inputs) {
        inputs[campo].value = cliente[campo] || "";
      }

      document.getElementById("modalClienteLabel").innerText = "Editar Cliente";
      btnSalvar.innerText = "Salvar Alterações";

      modalInstance.show();
    });
  });

  // Evento para novo cliente
  document.getElementById("btnNovoCliente")?.addEventListener("click", () => {
    inputId.value = "";
    for (const campo in inputs) {
      inputs[campo].value = "";
    }
    document.getElementById("modalClienteLabel").innerText = "Cadastro de Cliente";
    btnSalvar.innerText = "Cadastrar";
  });

  // Evento de Salvar/Cadastrar
  btnSalvar.addEventListener("click", function () {
    const id = inputId.value;

    const payload = {};
    for (const campo in inputs) {
      payload[campo] = inputs[campo].value.trim();
    }

    // Validação de campos obrigatórios mínimos
    if (!payload.nome_completo || !payload.email) {
      Swal.fire("Erro", "Preencha os campos obrigatórios!", "error");
      return;
    }

    // Validação de Email
    if (!isValidEmail(payload.email)) {
      Swal.fire("Erro", "Email inválido!", "error");
      return;
    }

    // Validação de Telefone (se informado)
    if (payload.telefone && !isValidTelefone(payload.telefone)) {
      Swal.fire("Erro", "Telefone inválido! Exemplo: (XX)XXXXX-XXXX ou (XX)XXXX-XXXX", "error");
      return;
    }

    // Validação de CPF/CNPJ (se informado)
    if (payload.cpf_cnpj && !isValidCpfCnpj(payload.cpf_cnpj)) {
      Swal.fire("Erro", "CPF/CNPJ inválido!", "error");
      return;
    }

    // Validação de Número da casa (se informado)
    if (payload.numero && !isValidNumero(payload.numero)) {
      Swal.fire("Erro", "Número da casa inválido! Deve ser um número maior ou igual a 0.", "error");
      return;
    }

    // Validação de CEP (se informado)
    if (payload.cep && !isValidCEP(payload.cep)) {
      Swal.fire("Erro", "CEP inválido! Deve conter 8 dígitos.", "error");
      return;
    }

    const rota = id ? `/admin/clientes/${id}` : "/admin/clientes";
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
          Swal.fire("Sucesso", res.msg, "success").then(() => location.reload());
          modalInstance.hide();
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
