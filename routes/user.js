const express = require('express');
const router = express.Router();
module.exports = router

const { getUsers, getUserById, createUser, updateUser, deleteUser } = require('../controlleur/user_controller');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/update', updateUser);
router.delete('/:id/delete', deleteUser);