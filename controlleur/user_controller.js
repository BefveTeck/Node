const AddressUser = require("../models/AddressUser");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

const verifInputs = (req, res) => {
  body("lastname", "le nom est obligatoire").isstring().notempty();
  body("firstname", "Le prénom est obligatoire").isstring().notempty();
  body("email", "L'email est obligatoire").isEmail().notempty();
  body("password", "Le mot de passe est obligatoire").isString().notempty();
  body("passwordConfirm", "La confirmation du mote de passe est obligatoire")
    .isString()
    .notempty();
  body("street", "Le numéroe est nom de voie est obligatoire")
    .isString()
    .notempty();
  body("zipcode", "Le code postale est obligatoire").isPostalCode().notEmpty();
  body("city", "La ville est obligatoire").isString().notEmpty();

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
};

const findUserByMail = async (req) => {
  return await User.findOne({ email: req.body.email });
};

const findAdress = async (req) => {
  return await AdressUser.findOne({
    street: req.body.street,
    zipcode: req.body.zipcode,
    city: req.body.city,
  });
};

const createAdress = async (req) => {
  const newAdress = new AdressUser({
    street: req.body.street,
    zipcode: req.body.zipcode,
    city: req.body.city,
  });
  return await newAdress.save();
};

const newUser = async (idAddress, req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash,
    address: idAddress,
  });

  user
    .save()
    .then((result) => {
      res.status(200).json({ message: result });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

exports.addUser =(req,res) => {

}

exports.createUser = (req, res) => {
  try {
    verifInputs(req, res);

    findUserByMail(req)
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "User already exists" });
        } else {
          findAdress(req)
            .then((address) => {
              if (adress) {
                newUser(adress._id, req, res);
              } else {
                createAdress(req)
                  .then((result) => {})
                  .catch((error) => {});
              }
            })
            .catch((error) => {
              console.log("Erreur findAdress", error);
              res.status(500).json({ error: error });
            });
        }
      })
      .catch((error) => {
        console.log("findUser", error);
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.log("try error:", error);
  }
};

exports.getUsers = () => {};
exports.getUserById = () => {};
exports.updateUser = () => {};
exports.deleteUser = () => {};

// équivaut a
// module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser}
