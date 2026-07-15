const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const tokenblackListModel = require('../models/blackList.model')


async function authMiddleware(req,res,next){
  
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
  
  if(!token){
    return res.status(401).json({
      message: "Unauthorized access, token is missing"
    })
  }

  const isTokenBlacklisted = await tokenblackListModel.findOne({ token })

  if(isTokenBlacklisted){
    return res.status(401).json({
      message: "Unauthorized access, token is blacklisted"
    })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.userID)

    req.user = user

    return next()
    
  } catch (error) {

    return res.status(401).json({
      message: "Unauthorized access , token is invalid"
    })
  }

}

async function authSystemUserMiddleware(req,res,next){

  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
  
  if(!token){
    return res.status(401).json({
      message: "Unauthorized access, token is missing"
    })
  }
  
  const isTokenBlacklisted = await tokenblackListModel.findOne({ token })

  if(isTokenBlacklisted){
    return res.status(401).json({
      message: "Unauthorized access, token is blacklisted"
    })
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await userModel.findById(decoded.userID).select("+systemUser")

    if(!user.systemUser){
      return res.status(403).json({
        message: "Forbidden access, only system user can perform this action"
      })
    }

    req.user = user

    return next()
    
  } catch (error) {

    return res.status(401).json({
      message: "Unauthorized access , token is invalid"
    })
  }
}


module.exports = {
  authMiddleware,
  authSystemUserMiddleware
}