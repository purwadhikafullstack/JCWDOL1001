const { Op } = require("sequelize");
const moment = require("moment");
const { middlewareErrorHandling } = require("../../middleware");
const {
  Transaction_List,
  Transaction_Detail,
  Transaction_Status,
  Discount_Transaction,
  Discount,
} = require("../../model/relation.js");
const {
  Product_List,
} = require("../../model/product");
const {
  User_Address,
  User_Account,
  User_Profile,
} = require("../../model/user");

const getTransactions = async (req, res, next) => {
  try {
    const { userId, roleId } = req.user;
    const { statusId } = req.params;
    const {
      page,
      sortDate,
      startFrom,
      endFrom,
      sortTotal,
      filterName,
      invoice,
    } = req.query;

    const limit = 5;

    const options = {
      offset: page > 1 ? (page - 1) * limit : 0,
      limit,
    };

    let whereCondition = {};
    const sort = [];
    const filtering = {};

    if (roleId === 1) {
      whereCondition = { statusId };
    } else {
      whereCondition = { userId, statusId };
    }

    if (startFrom) {
      if (roleId === 1) {
        whereCondition.updatedAt = {
          [Op.gte]: moment.utc(startFrom).format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment
            .utc(endFrom)
            .add(23, "hours")
            .add(59, "minutes")
            .add(59, "seconds")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
      }

      if (roleId === 2) {
        whereCondition.createdAt = {
          [Op.gte]: moment.utc(startFrom).format("YYYY-MM-DD HH:mm:ss"),
          [Op.lte]: moment
            .utc(endFrom)
            .add(23, "hours")
            .add(59, "minutes")
            .add(59, "seconds")
            .format("YYYY-MM-DD HH:mm:ss"),
        };
        console.log(
          "Start",
          moment.utc(startFrom).format("YYYY-MM-DD HH:mm:ss")
        );
        console.log(
          "End",
          moment
            .utc(endFrom)
            .add(23, "hours")
            .add(59, "minutes")
            .add(59, "seconds")
            .format("YYYY-MM-DD HH:mm:ss")
        );
      }
    }

    if (filterName) filtering.name = { name: { [Op.like]: `%${filterName}%` } };

    if (sortDate) {
      roleId === 1
        ? sort.push(["updatedAt", sortDate ? sortDate : "DESC"])
        : sort.push(["createdAt", sortDate ? sortDate : "DESC"]);
    }
    if (sortTotal) sort.push(["total", sortTotal]);
    if (invoice) whereCondition.invoice = { [Op.like]: `%${invoice}%` };

    const transaction = await Transaction_List?.findAll({
      include: [
        {
          model: Transaction_Status,
          as: "transactionStatus",
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          include: {
            model: Product_List,
            as: "listedTransaction",
          },
        },
        {
          model: User_Address,
        },
        {
          model: User_Account,
          attributes: ["email"],
        },
        {
          model: User_Profile,
          as: "userProfile",
          where: filtering.name,
        },
        {
          model: Discount_Transaction,
          attributes: { exclude: ["productListId"] },
          include: {
            model: Discount,
          },
        },
      ],
      where: whereCondition,
      order: sort,
      ...options,
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    if (statusId !== 7) {
      delete transaction?.dataValues?.canceledBy;
      delete transaction?.dataValues?.message;
    }

    const totalTransactions = await Transaction_List.count({
      where: whereCondition,
    });
    const totalPage = Math.ceil(totalTransactions / limit);

    res.status(200).json({
      type: "success",
      message: "Here are your order lists",
      totalPage,
      currentPage: +page,
      nextPage: +page === totalPage ? null : +page + 1,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

const getOngoingTransactions = async (req, res, next) => {
  try {
    const { userId } = req.user;

    let whereCondition = {};

    if (userId === 1) {
      whereCondition = { statusId: { [Op.not]: [6, 7] } };
    } else {
      whereCondition = { userId, statusId: { [Op.not]: [6, 7] } };
    }

    const transactions = await Transaction_List?.findAll({
      where: whereCondition,
    });

    const statuses = await Transaction_Status?.findAll();

    const data = {
      totalTransactions: transactions.length,
      transactions: [],
    };

    statuses.forEach((status) => {
      const statusId = status.statusId;
      const statusDesc = status.statusDesc;

      if (statusId !== 7 && statusId !== 6) {
        const total = transactions.filter(
          (transaction) => transaction.statusId === statusId
        ).length;

        data.transactions.push({ statusId, statusDesc, total });
      }
    });

    res.status(200).json({
      type: "success",
      message: "Here are your ongoing transactions",
      data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTransactions,
  getOngoingTransactions
}