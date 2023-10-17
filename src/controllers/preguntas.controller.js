import { pool } from '../db.js'

export const getPreguntas = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM preguntas')
        res.json(rows)
    }catch (error){
       return res.status(500).json({
           message: 'Error interno'
       })
    }
}

export const getPregunta = async (req, res) => {
    try{
        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [req.params.id])

        if(rows.length <= 0) return res.status(404).json({message: 'Pregunta no encontrada'})

        res.json(rows[0])
    }catch (error){
        return res.status(500).json({
            message: 'Error interno'
        })
    }
}

export const createPreguntas = async (req, res) => {
    try{
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 } = req.body
        const  [ rows ] = await pool.query( 'INSERT INTO preguntas (categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3) VALUES (?,?,?,?,?,?)', [ categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 ] )
        res.send({
            id: rows.insertId,
            categoria,
            pregunta,
            respuesta,
            incorrecta1,
            incorrecta2,
            incorrecta3
        })
    }catch (error){
        return res.status(500).json({
            message: 'Error interno'
        })
    }


}

export const updatePreguntas = async (req, res) => {
    try{
        const {id} = req.params
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3  } = req.body

        const [result] = await pool.query('UPDATE preguntas SET categoria = IFNULL(?, categoria) , pregunta = IFNULL(?, pregunta), respuesta = IFNULL(?, respuesta ), incorrecta1 = IFNULL(?, incorrecta1), incorrecta2 = IFNULL(?, incorrecta2), incorrecta3 = IFNULL(?, incorrecta3) WHERE id = ?', [ categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3, id ])

        if (result.affectedRows === 0) return res.status(404).json({message: 'Pregunta no encontrada'})

        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id])

        res.json(rows[0])

    }catch (error){
        return res.status(500).json({
            message: 'Error interno'
        })
    }

}

export const deletPreguntas = async (req, res) => {
    try{
        const [result] = await pool.query('DELETE FROM preguntas WHERE id = ?', [req.params.id])

        if(result.affectedRows <= 0) return res.status(404).json({message: 'Pregunta no encontrada'})

        res.sendStatus(204)
    }catch (error){
        return res.status(500).json({
            message: 'Error interno'
        })
    }
}