const pkmnService = require('../services/pkmn.service');

const getTypes = (req, res) => {
  const types = pkmnService.getAllTypes();

  res.status(200).json({
    success: true,
    count: types.length,
    data: types
  });
};

module.exports = {
  getTypes
};