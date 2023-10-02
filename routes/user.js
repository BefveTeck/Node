const express = require('express');

const router = express.Router();
const { getUsers, getUser, getUserById, createUser, updateUser, deleteUser, addUser, modifyUser, removeUser} = require('../controlleur/users_controller');

router.get('/users/create', addUser)
router.post('/users/create/add', createUser);

router.get('/users', getUsers);

router.get('/users/:id', getUserById, getUser);

router.get('/users/:id/update',modifyUser);
router.put('/users:id/update', updateUser);

router.get('/users/:id/delete', removeUser);
router.delete('users/:id/delete', deleteUser);


module.exports = router