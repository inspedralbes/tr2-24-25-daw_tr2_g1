const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const routes = require('./urls');

// Middleware
app.use(cors()); // Allow all CORS for dev
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Mount routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Backend funcionando correctamente con Docker! (Updated)');
});

app.listen(port, () => {
    console.log(`Servidor backend escuchando en el puerto ${port}`);
});
