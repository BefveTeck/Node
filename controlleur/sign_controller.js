const AdressUser = require('../models/AddressUser');

const User = require('../models/User');
const bcrypt = require('bcrypt');
const path = require('path');

const verifInputs = require('../middlewares/verifinputs');
const findUserByMail = require('../middlewares/findUserByMail');
const findAddress = require('../middlewares/findAddress');
const createAddress = require('../middlewares/createAddress');

const signUser = async (idAddress, req, res) => {
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
      req.session.userConnected = `Bienvenue ${result.lastname} ${result.firstname} créé avec succès.`;
      res.status(200).redirect("/");
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
  };
exports.signup = async (req, res) => {
    const userConnected = req.session.userConnected ? req.session.userConnected : null;
    res.status(200).render(path.join(__dirname, '../pages/sign/signup.ejs'), {userConnected});
}

exports.createUser = async (req,res) => {
    try {
        if(req.body.password === req.body.confirm){
            verifInputs(req, res);

            await findUserByMail(req).then(user => {
                if(user) { 
                    res.status(400).send('User Already Exist'); 
                }
                else {
                    findAddress(req).then(address => {
                        if(address) { signUser(address.id, req, res) }
                            else {
                                createAddress(req)
                                .then(result => signUser(result.id, req, res))
                                .catch(error => res.status(400).send(
                                'Erreur Create Address ' + error.message))
                            }
                        }).catch(error => 
                            res.status(400).send('Erreur Find Address ' + error.message))
                        }
                        }).catch(error => res.status(404).send('User Already Exist : ' + error.message))
                    }
                        else{
                            res.status(500).send('Les mots de passe ne sont pas identique ')
                        }
                    }   catch(error) {
                            res.status(500).send('Erreur Sign CreateUser Try' + error.message)
                         }
                    }
exports.signin = async (req, res) => {
    const userConnected = req.session.userConnected ? req.session.userConnected: null;
        if(userConnected) {
            res.status(300).redirect(`/`);
        } else {
            res.status(200).render(
            path.join(__dirname, `../pages/sign/signin.ejs`));
        }
};

exports.login = async (req, res) => {
    try {
        await findUserByMail(req).then(user => {
            const compare = bcrypt.compare(req.body.password, user.password);
            if(compare) {
            req.session.userConnected = `Bienvenue ${user.lastname} ${user.firstname}`;
            res.status(200).redirect('/');
            } else {
            res.status(401).send('Mot de passe ou Email incorrect');
            }
        })
        .catch(error => res.status(404).send('User not found ' + error.message))
    }
    catch (error) {
        console.log(error);
    }
}

exports.logout = (req, res) => {}

exports.disconnect = (req, res) => {}

