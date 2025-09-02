// vai carregar os veiculos cadastrados  que ja estao no banco
function carregarVeiculos() {
  fetch("/api/veiculos")
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("tabela-veiculos");
      tbody.innerHTML = "";
      data.forEach(v => {
        tbody.innerHTML += `
          <tr>
            <td>${v.id}</td>
            <td>${v.placa}</td>
            <td>${v.modelo}</td>
            <td>${v.ano}</td>
            <td>
              <button class="btn btn-warning btn-sm" 
                onclick="abrirEdicao(${v.id}, '${v.placa}', '${v.modelo}', '${v.ano}')">Editar</button>
              <button class="btn btn-danger btn-sm" 
                onclick="excluirVeiculo(${v.id})">Excluir</button>
            </td>
          </tr>
        `;
      });
    })
    .catch(err => console.error("Erro ao carregar veículos:", err));
}

//vai  abrir o modal de edição
function abrirEdicao(id, placa, modelo, ano) {
  document.getElementById("editId").value = id;
  document.getElementById("editPlaca").value = placa;
  document.getElementById("editModelo").value = modelo;
  document.getElementById("editAno").value = ano;

  let modal = new bootstrap.Modal(document.getElementById("Editarinfo"));
  modal.show();
}

// Vai salvar as alterações feitas no modal com o PUT.
document.querySelector("#Editarinfo .btn-primary").addEventListener("click", () => {
  const id = document.getElementById("editId").value;
  const placa = document.getElementById("editPlaca").value;
  const modelo = document.getElementById("editModelo").value;
  const ano = document.getElementById("editAno").value;

  fetch(`/api/veiculos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ placa, modelo, ano })
  })
  .then(res => {
    if (!res.ok) throw new Error("Erro ao atualizar");
    return res.json();
  })
  .then(() => {
    carregarVeiculos(); // Atualiza tabela
    bootstrap.Modal.getInstance(document.getElementById("Editarinfo")).hide(); // Fecha modal
  })
  .catch(err => console.error("Erro ao salvar:", err));
});

// Excluir veículo (DELETE)
function excluirVeiculo(id) {
  if (confirm("Tem certeza que deseja excluir este veículo?")) {
    fetch(`/api/veiculos/${id}`, { method: "DELETE" })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao excluir");
        return res.json();
      })
      .then(() => carregarVeiculos())
      .catch(err => console.error("Erro ao excluir:", err));
  }
}

// Carregar veículos ao abrir página
document.addEventListener("DOMContentLoaded", carregarVeiculos);

