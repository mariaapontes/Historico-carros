const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,"public")))

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "oficina_marycar",
})

//-------ROTAS-------//
// Rota POST para processar o login
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"
    ));
})

// login (POST)
app.post("/login", (req, res) => {
    const { cpf, senha } = req.body;
    db.query("SELECT * FROM usuarios WHERE cpf=? AND senha=?", [cpf, senha], (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.redirect("/veiculos");
        } else {
            res.send("Login inválido!");
        }
    })
})
app.get("/veiculos", (req, res) => {
     res.sendFile(path.join(__dirname, "public", "veiculos.html"
    ));
})
// get veiculos
app.get("/api/veiculos", (req, res) => {
    db.query("SELECT * FROM veiculos", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});
app.get("/cadastro", (req, res) => {
     res.sendFile(path.join(__dirname, "public", "cadastro.html"
    ));
   
});

// Cadastrar Veículos (POST)
app.post("/cadastro", (req, res) => {
  const { placa, modelo, ano } = req.body;
  db.query(
    "INSERT INTO veiculos (placa, modelo, ano) VALUES (?, ?, ?)",
    [placa, modelo, ano],
    (err, result) => {
      if (err) throw err;
      res.redirect("/veiculos"); // redireciona de volta para lista
    }
  );
})
app.put("/api/veiculos/:id", (req, res) => {
  const { placa, modelo, ano } = req.body;
  db.query(
    "UPDATE veiculos SET placa=?, modelo=?, ano=? WHERE id=?",
    [placa, modelo, ano, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao atualizar veículo" });
      if (result.affectedRows === 0) return res.status(404).json({ error: "Veículo não encontrado" });
      res.json({ message: "Veículo atualizado!" });
    }
  );
})
// Excluir veículo (DELETE via fetch)
app.delete("/api/veiculos/:id", (req, res) => {
  db.query("DELETE FROM veiculos WHERE id=?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir veículo" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Veículo não encontrado" });
    res.json({ message: "Veículo excluído!" });
  });
});

// Inicia o servidor na porta 3000
app.listen(8080, () =>
  console.log("Servidor rodando em http://localhost:8080")
);
