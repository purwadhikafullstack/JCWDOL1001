const { Op, QueryTypes } = require("sequelize");
const db = require("../../model/index")

const getReport = async (req, res, next) => {
  try {
    const {startFrom, endFrom} = req.query
    const {statusId} = req.params

    const transaction =  await db.sequelize.query(
        `SELECT 
          SUM(total) as total, 
          DATE_Format(updatedAt,'%Y-%m-%d') as tanggal
        FROM apotek.transaction_lists
        ${statusId ? `WHERE statusId LIKE '${statusId}'` : ""}
        GROUP BY tanggal
        ${startFrom ? `HAVING tanggal BETWEEN '${startFrom}' AND '${endFrom}'` : ""}
        ORDER BY tanggal ASC;`, 
        { type: QueryTypes.SELECT }
    )

    res.status(200).json({
        type: "success", 
        message: "Data berhasil dimuat", 
        report: transaction
    })

  } catch (error) {
      next(error)
  }
}

module.exports = {
  getReport
}