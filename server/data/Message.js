const mongoose = require('mongoose')
const schemaTypes = mongoose.SchemaTypes

const MAXLEGTH = [1000, 'The message should not be more than 1000 characters']
const REQUIRED = '{PATH} is required'

let messageSchema = mongoose.Schema({
  user: {type: schemaTypes.ObjectId, ref: 'User', required: REQUIRED},
  content: {type: schemaTypes.String, required: REQUIRED, maxlength: MAXLEGTH},
  thread: {type: schemaTypes.ObjectId, ref: 'Thread'},
  creationDate: {type: schemaTypes.Date, default: Date.now()},
  isLiked: {type: schemaTypes.Boolean, default: false}
})

let Message = mongoose.model('Message', messageSchema)

module.exports = Message
