const userModel = require('../models/user.model')
const bcrypt = require('bcrypt');

exports.createUser = async (req,res) => {
    let user ;
    try {
        let userData = structuredClone(req.body); //Pour éviter de modifier le body

        let hash = await bcrypt.hash(userData.password, 10)
        userData.password = hash;
        user = await userModel.create(userData);
        res.status(201).send({ id: user._id });
        } catch (error) {
        throw error
        }
      return user;
}

exports.getUserById = async (id) => {
  return await userModel.findById(id); 
};


exports.getUserByEmail = async (email) => {
  return await userModel.findOne({ email: email });
};

exports.deleteUserById = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });
    res.status(200).send({ message: 'Utilisateur supprimé', id: user._id });
  } catch (err) {
    res.status(400).send(err);
  }
};

exports.updateUserById = async (req, res) => {
    try {
        const user = await userModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!user) return res.status(404).send({ message: 'Utilisateur non trouvé' });
            res.status(200).send(user);
        } catch (err) {
            res.status(400).send(err);
        }
};

exports.verifyPassword = async (sentPassword, user) =>
{
  return await bcrypt.compare(sentPassword, user.password)
};