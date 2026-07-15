const mongoose = require('mongoose')

const tokenblackListSchema = new mongoose.Schema({
  token:{
    type: String,
    required: [true, "Token is required to blacklist"],
    unique: [ true, "Token is already blacklisted"]
  },
},{
  timestamps: true
})

//TTL index for token blacklisting
tokenblackListSchema.index({createdAt: 1}, {
  expireAfterSeconds: 60*60*24*3 // 3 days
}) 

const tokenblackListModel = mongoose.model("tokenblackList", tokenblackListSchema)

module.exports = tokenblackListModel