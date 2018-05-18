'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const newRecipeSchema = mongoose.Schema({
    userId: {type: String},
    id: {type: String},
    title: {type: String, required: true},
    img: {type: String},
    content: {type: String},
});

newRecipeSchema.methods.serialize = function() {
    return {
        id: this._id,
        userId: this.userId,
        title: this.title,
        img: this.img,
        content: this.content,
    };
}

const Recipe = mongoose.model('Recipe', newRecipeSchema);

module.exports = {Recipe};