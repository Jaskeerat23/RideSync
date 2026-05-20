const dashboard_service = require('../services/analytical_dashboard.service');

async function get_basic_analysis(req, res) {
    try {
        const _id = req.user._id;
        console.log(_id);
        const result = await dashboard_service.get_basic_analysis(_id);

        if(!result.success) {
            return res.status(400).json({
                success: true,
                message: result.message
            });
        }

        res.status(201).json({
            success: true,
            data: result.data
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

async function get_successful_rides(req, res) {
    try {
        const _id = req.user._id;
        console.log(_id);
        const result = await dashboard_service.get_successful_rides(_id);

        if(!result.success) {
            return res.status(400).json({
                success: true,
                message: result.message
            });
        }

        res.status(201).json({
            success: true,
            data: result.data
        });

    } catch (err) {
        console.error(err);
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

module.exports = {
    get_basic_analysis,
    get_successful_rides
};