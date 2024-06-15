const Log = require('../models/log');
const LogError = require('../models/error');

exports.addLog = async (req, res, next) => {
    const log = new Log(req.user.user_id, req.body.screen, req.body.action, req.body.log);
    log
    .save()
    .then(([rows, fieldData]) => {
        res.status(200).json({
            success: 1
        });
    })
    .catch(function(error) {
        const myError = new LogError(error.message, 'log:', req.user.user_id, -1, req.body.action);
        myError
        .save();
        res.status(200).json({
            success: 0, 
            error: 3,
            errorMsg: 'An error occured while logging'
        });
    });
}
