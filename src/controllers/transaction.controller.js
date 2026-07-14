const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/legder.model")
const emailService = require("../services/email.service") 
const accountModel = require("../models/account.model") 
const mongoose = require("mongoose")

/**
 * - Create a new transaction 
 * THE 10-STEP TRANSFER FLOW:
   * 1. Validate the request body to ensure that all required fields are present and valid.
   * 2. Validate the idempotency key to ensure that it is unique and has not been used before.
   * 3. Check account status
   * 4. Derive sender balance from ledger
   * 5. Create transaction (PENDING)
   * 6. Create DEBIT ledger entry for sender account
   * 7. Create CREDIT ledger entry for receiver account
   * 8. Mark transaction as COMPLETED
   * 9. Commit MongoDB session
   * 10. Send email notifications to both sender and receiver
 */


async function createTransaction(req, res){ 

  /**
   * 1. Validate the request body to ensure that all required fields are present and valid.
   */
  const {fromAccount, toAccount, amount, idempotencyKey} = req.body
  if(!fromAccount || !toAccount || !amount || !idempotencyKey){
    return res.status(400).json({
      message: "Missing required fields in request body"
    })
  }
  const fromUserAccount = await accountModel.findOne({
    _id:fromAccount
  })
  const toUserAccount = await accountModel.findOne({
    _id:toAccount
  })
  if(!fromUserAccount || !toUserAccount){
    return res.status(400).json({
      message: "Sender or receiver account not found"
    })
  }

  /**
   * 2. Validate the idempotency key to ensure that it is unique and has not been used before.
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey:idempotencyKey
  })
  if(isTransactionAlreadyExists){
    if(isTransactionAlreadyExists.status === "COMPLETED"){
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists
      })
    }
    if(isTransactionAlreadyExists.status === "PENDING"){
      return res.status(200).json({
        message: "Transaction is still pending",
      })
    }
    if(isTransactionAlreadyExists.status === "FAILED"){
      return res.status(500).json({
        message: "Transaction failed, please try again",
      })
    }
    if(isTransactionAlreadyExists.status === "REVERSED"){
      return res.status(500).json({
        message: "Transaction was reversed, please try again",
      })
    }
    // return res.status(400).json({
    //   message: "Transaction with this idempotency key already exists"
    // })
  }


  /**
   * 3. Check account status
   */

  if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
    return res.status(400).json({
      message: "Sender or receiver account is not active"
    })
  }

  /**
   * 4. Derive sender balance from ledger
   */
  const Balance = await fromUserAccount.getBalance()

  if(Balance < amount){
    return res.status(400).json({
      message: `Insufficient balance in sender account. Current balance is ${Balance} and transaction amount is ${amount}`
    })
  }
  
  /**
   * 5. Create transaction (PENDING)
   */
  const session = await mongoose.startSession()
  session.startTransaction()

  const transaction = await transactionModel.create({
    fromAccount,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING"
  }, {session})
  
  const debitLedgerEntry = await ledgerModel.create({
    account: fromAccount,
    transaction: transaction._id,
    type: "DEBIT",
    amount: amount
  }, {session})

  const creditLedgerEntry = await ledgerModel.create({
    account: toAccount,
    transaction: transaction._id,
    type: "CREDIT",
    amount: amount
  }, {session})

  transaction.status = "COMPLETED"
  await transaction.save({session})

  await session.commitTransaction()
  session.endSession()

  /**
   * 10. Send email notifications to both sender and receiver
   */
  await emailService.sendTransactionEmail(req.user.email, req.user.name ,amount , toAccount)
  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction
  })

}


module.exports = {
  createTransaction
}