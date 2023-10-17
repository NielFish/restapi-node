import { Router } from "express";
import {getPreguntas, getPregunta, createPreguntas, updatePreguntas, deletPreguntas} from "../controllers/preguntas.controller.js";


const router = Router();

router.get('/preguntas', getPreguntas)
router.get('/preguntas/:id', getPregunta)


router.post('/preguntas', createPreguntas)
router.patch('/preguntas/:id', updatePreguntas) //Uso Patch en vez de Put porque Put actualiza todos los campos y Patch solo los que se le indiquen
router.delete('/preguntas/:id', deletPreguntas)

export default router;