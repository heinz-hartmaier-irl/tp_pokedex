const userService = require('../services/user.service');
const bcrypt = require('bcrypt');
const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken');


exports.register = async (req,res) => {
    let user ;
    try {
        let userData = structuredClone(req.body); //Pour éviter de modifier le body

        let hash = await bcrypt.hash(userData.password, 10)
        userData.password = hash;
        user = await userModel.create(userData);
        res.status(201).json({ message: 'Utilisateur crée avec succèes' });
        } catch (error) {
        throw error
        }
      return user;
}

exports.checkUser = (req, res) => {
    res.status(200).json({ message: "CheckUser OK" });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    const isValid = await userService.verifyPassword(password, user);
    if (!isValid) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect'
      });
    }

    //si tout est bon, on donne l'accès
    res.status(200).json({
      userID: user._id,
      token: jwt.sign(
        { 
            userId : user._id,
            role : user.role
         },
        process.env.TOKEN_SECRET,
        { expiresIn : '2h'}
        )
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erreur serveur'
    });
  }
};