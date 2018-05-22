const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Recipe} = require('./models');

//GET User

router.get('/user/:userId', (req, res) =>{
    Recipe
        .find({userId: req.params.userId})
        .then(recipe=>{
            res.json({
                recipe: recipe.map(
                    (brew) => brew.serialize())
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/:id', (req, res) => {
    Recipe
        .findById(req.params.id)
        .then(recipe => res.json(recipe.serialize()))
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Internal server error'})
        });
});

router.post('/', (req, res) => {
    const requiredFields = ['title', 'userId'];
    for (let i = 0; i < requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.error(message);
            return res.status(400).send(message);
        }
    }

    Recipe
        .create({
            title: req.body.title,
            img: req.body.img,
            userId: req.body.userId,
            content: req.body.content,
        })
        .then(recipe => res.status(201).json(recipe.serialize()))
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error'});
        });
})

router.put('/:id', (req, res) => {

    /*if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
      const message = (
        `Request path id (${req.params.id}) and request body id ` +
        `(${req.body.id}) must match`);
      console.error(message);
      return res.status(400).json({ message: message });
    }
    */
  
    const toUpdate = {};
    const updateableFields = ['content'];
  
    updateableFields.forEach(field => {
      if (field in req.body) {
        toUpdate[field] = req.body[field];
      }
    });
  
    Recipe
      .findByIdAndUpdate(req.params.id, { $set: toUpdate })
      .then(recipe => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
  });
  
  router.delete('/:id', (req, res) => {
    Recipe
      .findByIdAndRemove(req.params.id)
      .then(recipe => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
  });
  
  
  module.exports = router;