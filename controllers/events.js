const { response } = require("express");
const Evento = require("../models/Evento");


const getEventos = async (req, res = response) => {

    const eventos = await Evento.find()
        .populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })

}

const crearEvento = async (req, res = response) => {
    const evento = new Evento(req.body);

    try {

        evento.user = req.uid;
        const eventoGuardado = await evento.save();

        res.json({
            ok: true,
            eventoGuardado
        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error,
            msg: 'Hable con el administrdddador'
        })
    }

}

const actualizarEvento = async (req, res = response) => {

    const eventoID = req.params.id;
    const { uid } = req;
    try {

        const evento = await Evento.findById(eventoID)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe evento para ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene autorización para editar este evento'
            })

        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(evento.id, nuevoEvento, { new: true });

        res.json({
            ok: true,
            evento: eventoActualizado

        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error,
            msg: 'Hable con el administrador'
        })
    }

}

const eliminarEvento = async (req, res = response) => {

    const eventoID = req.params.id;
    const { uid } = req;
    try {

        const evento = await Evento.findById(eventoID)
        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'no existe evento para ese id'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene autorización para editar este evento'
            })

        }



        await Evento.findOneAndDelete(eventoID);

        res.json({
            ok: true,
            msg: 'Evento eliminado con éxito'

        })

    } catch (error) {
        res.status(500).json({
            ok: false,
            error: error,
            msg: 'Hable con el administrador'
        })
    }
}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}