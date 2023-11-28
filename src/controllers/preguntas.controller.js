import { pool } from '../db.js';

const responseStructure = {
    success: true,
    data: [],
    message: '',
    errors: '',
    rows: 0,
};

export const getPreguntas = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM preguntas');
        responseStructure.data = rows;
        responseStructure.rows = rows.length;
        res.json(responseStructure);
    } catch (error) {
        responseStructure.success = false;
        responseStructure.message = 'Error interno';
        res.status(500).json(responseStructure);
    }
};

export const getPregunta = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [req.params.id]);
        if (rows.length <= 0) {
            responseStructure.success = false;
            responseStructure.message = 'Pregunta no encontrada';
            return res.status(404).json(responseStructure);
        }
        responseStructure.data = rows[0];
        res.json(responseStructure);
    } catch (error) {
        responseStructure.success = false;
        responseStructure.message = 'Error interno';
        res.status(500).json(responseStructure);
    }
};

export const createPreguntas = async (req, res) => {
    try {
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 } = req.body;
        if (!categoria || !pregunta || !respuesta || !incorrecta1 || !incorrecta2 || !incorrecta3) {
            responseStructure.success = false;
            responseStructure.message = 'Todos los campos son obligatorios';
            return res.status(400).json(responseStructure);
        }
        const [rows] = await pool.query('INSERT INTO preguntas (categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3) VALUES (?,?,?,?,?,?)', [categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3]);

        responseStructure.data = {
            id: rows.insertId,
            categoria,
            pregunta,
            respuesta,
            incorrecta1,
            incorrecta2,
            incorrecta3
        };
        res.json(responseStructure);
    } catch (error) {
        responseStructure.success = false;
        responseStructure.message = 'Error interno';
        res.status(500).json(responseStructure);
    }
};

export const updatePreguntas = async (req, res) => {
    try {
        const { id } = req.params;
        const { categoria, pregunta, respuesta, incorrecta1, incorrecta2, incorrecta3 } = req.body;

        const updateFields = {};

        if (categoria) updateFields.categoria = categoria;
        if (pregunta) updateFields.pregunta = pregunta;
        if (respuesta) updateFields.respuesta = respuesta;
        if (incorrecta1) updateFields.incorrecta1 = incorrecta1;
        if (incorrecta2) updateFields.incorrecta2 = incorrecta2;
        if (incorrecta3) updateFields.incorrecta3 = incorrecta3;

        const fieldNames = Object.keys(updateFields);
        const fieldValues = fieldNames.map(fieldName => updateFields[fieldName]);

        const updateQuery = `UPDATE preguntas SET ${fieldNames.map(fieldName => `${fieldName} = IFNULL(?, ${fieldName})`).join(', ')} WHERE id = ?`;

        const [result] = await pool.query(updateQuery, [...fieldValues, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Pregunta no encontrada' });
        }

        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id]);
        res.json(rows[0]);
    } catch (error) {
        return res.status(500).json({
            message: 'Error interno',
        });
    }
};


export const deletPreguntas = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM preguntas WHERE id = ?', [req.params.id]);
        if (result.affectedRows <= 0) {
            responseStructure.success = false;
            responseStructure.message = 'Pregunta no encontrada';
            return res.status(404).json(responseStructure);
        }
        responseStructure.message = 'Pregunta eliminada correctamente';
        res.json(responseStructure);
    } catch (error) {
        responseStructure.success = false;
        responseStructure.message = 'Error interno';
        res.status(500).json(responseStructure);
    }
};
