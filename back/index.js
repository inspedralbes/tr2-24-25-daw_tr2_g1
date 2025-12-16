const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente con Docker!');
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
