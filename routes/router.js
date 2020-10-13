const modelos = require('../database/dbconf')
const express = require('express');
const fetch = require("node-fetch");
const router = express.Router();

router.get('/', (req, res) => {
    res.send('welcome:  visit /consultar/cursos ')
})

router.get('/matricula/consultar', async(request, response) => {
    try {
        var result = await modelos.PagoModel.find().exec();
        response.json(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/pagos/consultar/pago/:curso_id', async(request, response) => {
    try {
        console.log("para:", request.params.curso_id)
        var result = await modelos.PagoModel.find({ cod_curso: request.params.curso_id }).exec();
        //console.log("result:", result[0].monto_pago)
        response.json(result[0].monto_pago);
    } catch (error) {
        response.status(500).send(error);
    }
});


router.post("/matricula/registrar", async(request, response) => {
    try {
        var pago = new modelos.PagoModel(request.body);
        var valido = validarPagos(pago.cod_estudiante, pago)
        valido.then(resul => {
            if (resul == true) {
                pago.save();
                response.json(pago)
            } else {
                response.json("estidiante || curso ,no validos")
            }
        })
    } catch (error) {
        response.status(500).send(error);
    }
});


function validarPagos(codigo_estudiante, pago) {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };
    const estado = fetch(`http://localhost:3000/api/v1/pagos/validarpago/${codigo_estudiante}`, requestOptions, pago)
        .then(response => response.json())
        .catch(error => console.log('error', error))
    return estado
}
module.exports = router;