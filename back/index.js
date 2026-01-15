const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente con Docker!');
});

app.post('/api/login-centre', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Falta el correu electrònic' });
    }

    try {
        // Buscamos si existe un centro con ese email
        // ATENCIÓN: Asegúrate de que 'db' es tu conexión a MySQL
        const [rows] = await db.query(
            'SELECT * FROM centres WHERE email_centre = ?', 
            [email]
        );

        if (rows.length > 0) {
            // ¡ENCONTRADO! 
            const centre = rows[0];
            res.json({ 
                success: true, 
                message: 'Login correcte', 
                centre: {
                    id: centre.id,
                    nom: centre.denominacio_completa,
                    codi: centre.codi_centre,
                    email: centre.email_centre
                }
            });
        } else {
            // NO ENCONTRADO
            res.status(404).json({ error: 'Aquest correu no pertany a cap centre registrat' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
