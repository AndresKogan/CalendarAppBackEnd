const { Router } = require("express");
const { check } = require("express-validator");
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { isDate } = require("../helpers/isDate");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();


router.get('/', validarJWT, getEventos);
router.post('/', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria.').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria.').custom(isDate),
    validarCampos
], validarJWT, crearEvento);
router.put('/:id', validarJWT, actualizarEvento);
router.delete('/:id', validarJWT, eliminarEvento);



module.exports = router;