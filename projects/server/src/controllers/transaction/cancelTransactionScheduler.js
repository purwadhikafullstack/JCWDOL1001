const cron = require("node-cron");
const { cancelExpiredTransactions } = require("./index.js")

const cancelTransactionScheduler = cron.schedule("* * * * *", () =>{
    cancelExpiredTransactions()
    console.log("✅ Success Cancel Transaction");
  })

module.exports = { cancelTransactionScheduler }