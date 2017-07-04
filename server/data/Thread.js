const mongoose = require('mongoose')
const schemaTypes = mongoose.SchemaTypes

let threadSchema = mongoose.Schema({
  users: [{type: schemaTypes.ObjectId, ref: 'User', required: true}],
  creationDate: {type: schemaTypes.Date, default: Date.now()},
  isBlockedBy: {type: schemaTypes.ObjectId, ref: 'User'}
})

let Thread = mongoose.model('Thread', threadSchema)

module.exports = Thread
