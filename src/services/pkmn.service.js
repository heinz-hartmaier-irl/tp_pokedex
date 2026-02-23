const PkmnType = require('../models/PkmnType');

const getAllTypes = () => {
  return PkmnType;
};

module.exports = {
  getAllTypes
};