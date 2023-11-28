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
        const updateFields = {
            categoria,
            pregunta,
            respuesta,
            incorrecta1,
            incorrecta2,
            incorrecta3,
        };

        // Filtra los campos que no están definidos para actualizar
        const validUpdateFields = Object.fromEntries(Object.entries(updateFields).filter(([key, value]) => value !== undefined));

        if (Object.keys(validUpdateFields).length === 0) {
            responseStructure.success = false;
            responseStructure.message = 'No se proporcionaron campos válidos para actualizar';
            return res.status(400).json(responseStructure);
        }

        const updateQuery = 'UPDATE preguntas SET ? WHERE id = ?';
        const [result] = await pool.query(updateQuery, [validUpdateFields, id]);

        if (result.affectedRows === 0) {
            responseStructure.success = false;
            responseStructure.message = 'Pregunta no encontrada';
            return res.status(404).json(responseStructure);
        }

        const [rows] = await pool.query('SELECT * FROM preguntas WHERE id = ?', [id]);
        responseStructure.data = rows[0];
        res.json(responseStructure);
    } catch (error) {
        responseStructure.success = false;
        responseStructure.message = 'Error interno';
        res.status(500).json(responseStructure);
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
