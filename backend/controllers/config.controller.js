const Config = require('../models/config.model');

// PÚBLICO: Obtener toda la configuración (Misión, Visión, Historia)
exports.getSettings = async (req, res) => {
    try {
        const settings = await Config.getAll();
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener configuración institucional.', error: error.message });
    }
};

// PROTEGIDO (Admin): Actualizar un valor de configuración
exports.updateSetting = async (req, res) => {
    const { clave, valor } = req.body;
    
    if (!clave || !valor) {
        return res.status(400).json({ message: 'Clave y valor son requeridos.' });
    }

    try {
        const updated = await Config.update(clave, valor);
        if (updated === 0) {
            return res.status(404).json({ message: `Clave '${clave}' no encontrada.` });
        }
        res.status(200).json({ message: `Configuración '${clave}' actualizada.`, clave, valor });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar configuración.', error: error.message });
    }
};