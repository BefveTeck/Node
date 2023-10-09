const AddressUser = require('../models/AddressUser');

const createAddress = async (req) => {
    const newAdress = new AddressUser({
      street: req.body.street,
      zipcode: req.body.zipcode,
      city: req.body.city,
    });
    return await newAdress.save();
  };

  module.exports = createAddress
