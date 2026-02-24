module.exports = {
  CAN_CREATE_PKMN: 'CAN_CREATE_PKMN',
  CAN_EDIT_PKMN: 'CAN_EDIT_PKMN',
  CAN_DELETE_PKMN: 'CAN_DELETE_PKMN',
  CAN_TAG_PKMN: 'CAN_TAG_PKMN'
};

const permissions = {
  CAN_CREATE_PKMN: 'CAN_CREATE_PKMN',
  CAN_EDIT_PKMN: 'CAN_EDIT_PKMN',
  CAN_DELETE_PKMN: 'CAN_DELETE_PKMN',
  CAN_TAG_PKMN: 'CAN_TAG_PKMN'
};

const rolePermissions = {
  ADMIN: [
    permissions.CAN_CREATE_PKMN,
    permissions.CAN_EDIT_PKMN,
    permissions.CAN_DELETE_PKMN,
    permissions.CAN_TAG_PKMN
  ],
  USER: [
    permissions.CAN_TAG_PKMN
  ]
};

module.exports = { permissions, rolePermissions };