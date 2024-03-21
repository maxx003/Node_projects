const express = require("express");
const ejs = require("ejs");
const app = express();

const port = 3000;

app.get("/", (req, res) => {
  const id = req.query.id;
  const username = req.query.username;

  res.send(`User ID: ${id}, Username: ${username}`);
});

app.get("/products/:id", (req, res) => {
  const productId = req.params.id;

  const products = [
    { id: 1, name: "Product A" },
    { id: 2, name: "Product B" },
    { id: 3, name: "Product C" },
  ];

  const product = products.find(
    (product) => product.id === parseInt(productId)
  );

  product
    ? res.send(`Product id: ${product.id}. Name: ${product.name}`)
    : res.status(404).send("Product not Found.");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
