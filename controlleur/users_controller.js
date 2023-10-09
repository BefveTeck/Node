const User = require("../models/User");
const path = require("path");
const bcrypt = require("bcrypt");
const verifInputs = require('../middlewares/verifinputs')
const findUserByMail = require('../middlewares/findUserByMail');
const findAddress = require('../middlewares/findAddress');
const createAddress = require('../middlewares/createAddress');

const findUserById = async (id) => {
  return await User.findOne({ _id: id })
  }

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
    req.session.successCreateUser = `Utilisateur ${result.lastname} ${result.firstname} créé avec succès.`;
    res.status(200).redirect("/users/create");
  })
  .catch((error) => {
    res.status(500).json({ error: error });
  });
};

const refreshUser = async (idAddress, req, res, user) => {
  const updatedUser = {
  _id: req.params.id,
  firstname: req.body.firstname,
  lastname: req.body.lastname,
  email: req.body.email,
  password: user.password,
  birth: req.body.birth,
  address: idAddress}
  await User.updateOne({ _id: req.params.id}, {...updatedUser})
  .then(result => {
  req.session.successUpdateUser = `
  Utilisateur ${updatedUser.lastname} ${updatedUser.firstname} mis à jour avec succès.`;
  res.redirect(`/users/${req.params.id}/update`);
  }).catch(error => {
  console.log(error.message)
  console.log('utilisateur non mis à jour Address trouvé');
  })}

 exports.getUserById = async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.params.id }).populate(
        "address"
      );
      res.locals.detailsUser = user;
      next();
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
 };

exports.addUser = (req, res) => {
  const successCreateUser = req.session.successCreateUser
    ? req.session.successCreateUser
    : null;
  res
    .status(200)
    .render(
      path.join(__dirname, "../pages/management/users/create-users.ejs"),
      { successCreateUser }
    );
};

exports.createUser = (req, res) => {
  try {
    verifInputs(req, res);

    findUserByMail(req)
      .then((user) => {
        if (user) {
          return res.status(409).json({ message: "user already exists" });
        } else {
          findAddress(req)
            .then((address) => {
              if (address) {
                newUser(address.id, req, res);
              } else {
                createAddress(req)
                  .then((result) => {
                    newUser(result.id, req, res);
                  })
                  .catch((error) => {
                    console.log("Erreur createAddress", error);
                  });
              }
            })
            .catch((error) => {
              console.log("Erreur,findAddress", error);
              res.status(500).json({ error: error });
            });
        }
      })
      .catch((error) => {
        console.log("Erreur,findUserByMail", error);
        res.status(500).json({ error: error });
      });
  } catch (error) {
    console.log("try error", error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const successDeleteUser = req.session.successDeleteUser ? req.session.successDeleteUser : null;
    const users = await User.find().populate("address");
    res
      .status(200)
      .render(
        path.join(__dirname, "../pages/management/users/list-users.ejs"),
        { users, successDeleteUser }
      );
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
};

exports.getUser = (req, res) => {
  const detailsUser = res.locals.detailsUser ? res.locals.detailsUser : null;
  res.status(200).render(path.join(__dirname, '../pages/management/users/detail-user.ejs'), { detailsUser})
};

exports.modifyUser = async (req, res, next) => {
  const detailsUser = res.locals.detailsUser;
  const successUpdateUser = req.session.successUpdateUser
  ? req.session.successUpdateUser : null;
  res.status(200).render(
  path.join(__dirname, `../pages/management/users/update-users.ejs`),
  { detailsUser, successUpdateUser });
  };

exports.updateUser = async (req, res) => { 
  try {
  verifInputs(req, res);
    await findUserById(req.params.id).then(user => {findAddress(req).then(address => {
      if(address) { refreshUser(address._id, req, res, user); }
      else { createAddress(req).then(newAddress => {
      refreshUser(newAddress.id, req, res, user);
        })}
      }).catch(error => {
        res.status(404).send('Error Find Address' + error.message);
      })
    }).catch(error => {
      res.status(404).send('Error Find User' + error.message);
    })
  }catch(error){
    console.error(error.message);
    res.status(500).send('Server Error controller');
  }
}

exports.removeUser = async (req, res, next) => {
  const detailsUser = res.locals.detailsUser;
  res.status(200).render(
  path.join(__dirname, `../pages/management/users/delete-users.ejs`),
  {detailsUser}
  )
  }

exports.deleteUser = async (req, res) => {
  try{
    await findUserById(req.params.id).then(user => {
    if(!user) {res.status(404).send('User not found');}
    else {
    user.deleteOne({_id: req.params.id}).then(() => {
    req.session.successDeleteUser =
    `Utilisateur ${user.lastname} ${user.firstname} supprimé avec succès.`;
    res.redirect(`/users`);
    }).catch(error => res.status(400).send('Error Delete User ' + error.message))
    }
    }).catch(error =>
    res.status(400).send('Error Find User ' + error.message)
    )
    } catch(error) {res.status(404).send('Error delete' + error.message);}
  };

// équivaut a
// module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser}
