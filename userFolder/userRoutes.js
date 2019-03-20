const express = require('express');
const md = require('../middleware/middleware');
const Users = require('./userDb');

const routes = express.Router();
const upperCaseUsername = md.upperCaseUsername;

// Initialize the req.body object
routes.use(express.json());

routes.get('/', async (req, res, next) => {
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch {
    next('Users information could not be retrieved.');
  }
});

routes.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await Users.getById(id);
    const userPosts = await Users.getUserPosts(id);
    if (user) {
      res.status(200).json(userPosts);
    } else {
      res.status(404).json({ error: 'User with this ID does not exist' });
    }
  } catch {
    next('Server Error. User information could not be retrieved.');
  }
});

routes.post('/', upperCaseUsername, async (req, res, next) => {
  if (req.body.name) {
    try {
      const users = await Users.insert(req.body);
      res.status(200).json(users);
    } catch {
      next('Server Error. Could not create new user.');
    }
  } else {
    res.status(400).json({ error: 'Please provide name for the user.' });
  }
});

routes.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedUser = await Users.remove(id);
    if (deletedUser > 0) {
      res.status(200).json({ message: `User with ID ${id} was deleted.` });
    } else {
      res.status(404).json({ error: `User with ID ${id} does not exist` });
    }
  } catch {
    next('Server Error. User information could not be retrieved.');
  }
});

routes.put('/:id', upperCaseUsername, async (req, res, next) => {
  const { id } = req.params;
  if (req.body.name) {
    try {
      const updatedUser = await Users.update(id, req.body);
      if (updatedUser > 0) {
        res.status(200).json({ message: `User with ID ${id} was edited.` });
      } else {
        res.status(404).json({ error: `User with ID ${id} does not exist` });
      }
    } catch {
      next('Server Error. User information could not be retrieved.');
    }
  } else {
    res.status(400).json({ error: 'Please provide name for the user.' });
  }
});

module.exports = routes;
