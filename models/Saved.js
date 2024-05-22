const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SavedSchema = new Schema({
     user: {
          type: Schema.Types.ObjectId,
          ref: 'Users',
          required: true
     },
     book: {
          type: Schema.Types.ObjectId,
          ref: 'Books',
          required: true
     },
     createdDate: { type: Date, default: Date.now }
});


const SavedModel = mongoose.model("Saved", SavedSchema);
module.exports = SavedModel;
