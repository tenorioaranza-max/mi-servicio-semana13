const express = require('express');
const app = express();
app.use(express.json());

const authorizeRole = (roleRequired) => {
    return (req, res, next) => {
        const user = { nombre: "Estudiante", rol: "usuario_estandar" }; 

        if (user.rol !== roleRequired) {
            const error = new Error('No autorizado: No tienes los permisos necesarios');
            error.statusCode = 401; 
            return next(error); 
        }
        next();
    };
};

app.get('/admin', authorizeRole('admin'), (req, res) => {
    res.send('Si ves esto, eres Admin');
});

app.get('/error-datos', (req, res, next) => {
    const error = new Error('Datos de entrada inválidos');
    error.statusCode = 400;
    next(error);
});

app.use((err, req, res, next) => {
    const status = err.statusCode || 500;
    
    console.error(`[LOG]: Error ${status} - ${err.message}`);
    
    res.status(status).json({
        error: status,
        mensaje: err.message,
        fecha: new Date().toLocaleString()
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});