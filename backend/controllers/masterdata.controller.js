// backend/controllers/masterdata.controller.js

const masterData = require('../data/masterdata');

exports.getMasterData = (req, res) => {
  res.status(200).json({
    success: true,
    data: masterData
  });
};
