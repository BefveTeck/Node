const AddressUser = require('../models/AddressUser');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const verifinputs = (req, res) => {
    body('lastname', 'le nom est obligatoire').isstring().notempty();
    body('firstname', 'Le prénom est obligatoire').isstring().notempty();
    body('email', 'L\'email est obligatoire').isEmail().notempty();
    body('password', 'Le mot de passe est obligatoire').isString().notempty();
    body('passwordConfirm', 'La confirmation du mote de passe est obligatoire').isString().notempty();
    body('street', 'Le numéroe est nom de voie est obligatoire').isString().notempty();
    body('zipcode', 'Le code postale est obligatoire').isPostalCode().notEmpty();
    body('city', 'La ville est obligatoire').isString().notEmpty();

    const errors = validationResult(req);

    if(!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    }
}

exports.createUser = () => {}
exports.getUsers = () => {}
exports.getUserById = () => {}
exports.updateUser = () => {}
exports.deleteUser = () => {}

// équivaut a 
// module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser}