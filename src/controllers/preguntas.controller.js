import { pool } from '../db.js'

export const getPreguntas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM preguntas');
        res.json({
            success: true,
            data: rows,
            message: "Datos obtenidos exitosamente",
            errors: "",
            rows: rows.length
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: "Error interno",
            errors: error.message,
            rows: 0
        });
    }
}


export const getPregunta = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [req.params.id])

        if (rows.length <= 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Pregunta no encontrada',
                errors: "",
                rows: 0
            });
        }

        res.json({
            success: true,
            data: rows[0],
            message: "Pregunta obtenida exitosamente",
            errors: "",
            rows: 1
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Error interno',
            errors: error.message,
            rows: 0
        });
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
    try {
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 } = req.body;

        if (!categoria || !pregunta || !respuesta || !incorrecta1 || !incorrecta2 || !incorrecta3) {
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const [rows] = await pool.query('INSERT INTO preguntas (categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3) VALUES (?,?,?,?,?,?)', [categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3]);
        
        res.send({
            id: rows.insertId,
            categoria,
            pregunta,
            respuesta,
            incorrecta1,
            incorrecta2,
            incorrecta3
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno'
        });
    }
}


export const updatePreguntas = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 } = req.body;

        const [result] = await pool.query('UPDATE preguntas SET categoria = IFNULL(?, categoria), pregunta = IFNULL(?, pregunta), respuesta = IFNULL(?, respuesta), incorrecta1 = IFNULL(?, incorrecta1), incorrecta2 = IFNULL(?, incorrecta2), incorrecta3 = IFNULL(?, incorrecta3) WHERE id = ?', [categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Pregunta no encontrada',
                errors: "",
                rows: 0
            });
        }

        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id]);

        res.json({
            success: true,
            data: rows[0],
            message: "Pregunta actualizada exitosamente",
            errors: "",
            rows: 1
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Error interno',
            errors: error.message,
            rows: 0
        });
    }
}

export const deletPreguntas = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM preguntas WHERE id = ?', [req.params.id]);

        if (result.affectedRows <= 0) {
            return res.status(404).json({
                success: false,
                data: [],
                message: 'Pregunta no encontrada',
                errors: "",
                rows: 0
            });
        }

        return res.json({
            success: true,
            data: [],
            message: 'Pregunta eliminada correctamente',
            errors: "",
            rows: 0
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            data: [],
            message: 'Error interno',
            errors: error.message,
            rows: 0
        });
    }
}
