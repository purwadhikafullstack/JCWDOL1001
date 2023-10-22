const { middlewareErrorHandling } = require("../../middleware");
const fs = require("fs");
const handlebars = require("handlebars");
const path = require("path");
const { helperTransporter } = require("../../helper/index.js");
const {
  Transaction_List,
  Transaction_Detail,
} = require("../../model/relation.js");
const {
  Product_Detail,
  Product_History,
  Product_Unit,
  Product_Recipe,
} = require("../../model/product");
const {
  User_Account,
  User_Profile,
} = require("../../model/user");
const { REDIRECT_URL, GMAIL } = require("../../config/index.js");

// update ongoing status to 7
const cancelTransaction = async (req, res, next) => {
  try {
    const { transactionId } = req.params;
    const { roleId, userId } = req.user;
    const { message } = req.body;

    let whereCondition = {};

    if (roleId === 1) {
      whereCondition = { transactionId };
    } else {
      whereCondition = { userId, transactionId };
    }

    const transaction = await Transaction_List?.findOne({
      include: [
        {
          model: User_Account,
          attributes: ["email"],
          include: {
            model: User_Profile,
            as: "userProfile",
          },
        },
        {
          model: Transaction_Detail,
          as: "transactionDetail",
          // include: {
          //   model: Product_List,
          //   as: "listedTransaction",
          // },
        },
      ],
      where: whereCondition,
    });

    if (!transaction)
      throw {
        status: middlewareErrorHandling.NOT_FOUND_STATUS,
        message: middlewareErrorHandling.TRANSACTION_NOT_FOUND,
      };

    // if (roleId === 2 && transaction.dataValues.statusId !== 1) {
    //   throw ({
    //     status: middlewareErrorHandling.BAD_REQUEST_STATUS,
    //     message: "Transaction cannot be canceled."
    //   })
    // }

    if ([1, 2, 3].includes(transaction.dataValues.statusId)) {
      await transaction.update({
        statusId: 7,
        message,
        canceledBy: roleId === 1 ? "Admin" : "User",
      });

      let reason = "";
      let information = "";
      // email jika dibatalkan oleh user
      if (roleId === 2) {
        information = "Pesananmu berhasil dibatalkan!";
      }
      // email jika dibatalkan oleh admin
      if (roleId === 1) {
        reason = transaction.dataValues?.message;
        information = `Mohon maaf, transaksi kamu tidak dapat dilanjutkan oleh Team Apotech karena ${reason}`;
      }

      //TODO : use these logic to proceed reverse stock
      //get transaction list
      const reverseList = await Transaction_Detail.findAll({
        where: {
          transactionId: transactionId,
        },
      });

      await cancelTransactionService(reverseList);
      // })

      const name = transaction.dataValues?.user_account.userProfile.name;
      const email = transaction.dataValues?.user_account.email;

      const template = fs.readFileSync(
        path.join(
          process.cwd(),
          "projects/server/templates",
          "cancel-transaction.html"
        ),
        "utf8"
      );
      const html = handlebars.compile(template)({
        name: name,
        information: information,
        link: REDIRECT_URL + `/products`,
      });

      const mailOptions = {
        from: `Apotech Team Support <${GMAIL}>`,
        to: email,
        subject: `Pesanan Dibatalkan ${transaction.dataValues?.invoice}`,
        html: html,
      };

      helperTransporter.transporter.sendMail(mailOptions, (error, info) => {
        if (error) throw error;
        console.log("Email sent: " + info.response);
      });

      res.status(200).json({
        type: "success",
        message: "Transaction canceled!",
        data: transaction,
      });
    } else {
      throw new Error("Transaction cannot be canceled.");
    }
  } catch (error) {
    next(error);
  }
};

async function cancelTransactionService(reverseList) {
  for (const item of reverseList) {
    // reverseList.map(async (item) =>{
    const { productId, quantity, buyOneGetOne } = item;
    //seandainya di product resep, ada barangnya
    const listRecipe = await Product_Recipe.findAll({
      where: {
        productId: productId,
      },
    });
    //produk satuan
    if (listRecipe.length === 0) {
      await normalProductCancel(productId, quantity, buyOneGetOne);
    }
    //stock yang berubah hanya komposisi. obat racik = kumpulan produk sec unit
    if (listRecipe.length !== 0) {
      //  await Promise.all(
      //   listRecipe.map(async (itemRecipe) =>{
      await customProductCancel(listRecipe, quantity);
      // }))
    }
  }
}

async function normalProductCancel(productId, quantity, buyOneGetOne) {
  const defaultUnit = await Product_Detail.findOne({
    where: {
      productId: productId,
      isDefault: true,
    },
    include: [
      {
        model: Product_Unit,
      },
    ],
  });

  await Product_History.create({
    productId: productId,
    unit: defaultUnit.dataValues?.product_unit.name,
    initialStock: defaultUnit.dataValues?.quantity,
    status: "Pembatalan Transaksi",
    type: "Penambahan",
    quantity: buyOneGetOne ? quantity * 2 : quantity,
    results:
      +defaultUnit.dataValues?.quantity +
      (buyOneGetOne ? quantity * 2 : quantity),
  });
  //update qtynya

  await Product_Detail.update(
    {
      quantity:
        +defaultUnit?.dataValues?.quantity +
        (buyOneGetOne ? quantity * 2 : quantity),
    },
    {
      where: {
        productId: productId,
        isDefault: true,
      },
    }
  );
  // return "1";
}

async function customProductCancel(listRecipe, quantity) {
  for (const itemRecipe of listRecipe) {
    await customIngredientCancel(itemRecipe, quantity);
  }
}

async function customIngredientCancel(itemRecipe, quantity) {
  const mainUnit = await Product_Detail.findOne({
    where: {
      productId: itemRecipe?.dataValues?.ingredientProductId,
      isDefault: true,
    },
    include: [
      {
        model: Product_Unit,
      },
    ],
  });
  const secUnit = await Product_Detail.findOne({
    where: {
      productId: itemRecipe?.dataValues?.ingredientProductId,
      isDefault: false,
    },
    include: [
      {
        model: Product_Unit,
      },
    ],
  });
  //seandainya awalnya stock ada 12 sec, kepake cmn 4
  //quantity di transaksi x quantity di resep produknya =  total ingredients yang kepakai
  //cth : kejual 3 biji, 1 biji perlu 3 butir panadol
  //brrti kepake 9 butir
  //cth cmn perlu 8, brrti kepake 3 main, sisa 1
  const totalIngredientQuantity = quantity * itemRecipe?.dataValues?.quantity;

  //stock obat racik : 1 quantity untuk obat raciknya
  //ingredient : 2 , convertion 2
  //sec ingredient > convertion
  // console.log("nilainya ",totalIngredientQuantity)
  //seandainya totalIngredientQuantity < main unit convertion?

  if (totalIngredientQuantity < mainUnit?.dataValues?.convertion) {
    //cek dlu apakah totalIngredientQuantity + secUnit.quantity >= convertion
    //kalau iya brrti terjadi konversi; cth : total 7, sec unit 1 conv 8, brrti awalnya ada 6

    if (
      totalIngredientQuantity + secUnit.dataValues?.quantity >=
      mainUnit?.dataValues?.convertion
    ) {
      //update both unit
      const currentSecUnitQuantity =
        totalIngredientQuantity +
        secUnit.dataValues?.quantity -
        mainUnit?.dataValues?.convertion;
      // console.log("initial stock di obat racik "+mainUnit.dataValues?.quantity)
      await Product_History.create({
        productId: itemRecipe?.dataValues?.ingredientProductId,
        unit: mainUnit.dataValues?.product_unit.name,
        initialStock: mainUnit.dataValues?.quantity,
        status: "Pembatalan Transaksi",
        type: "Penambahan",
        quantity: 1,
        results: +mainUnit.dataValues?.quantity + 1,
      });
      await Product_History.create({
        productId: itemRecipe?.dataValues?.ingredientProductId,
        unit: secUnit.dataValues?.product_unit.name,
        initialStock: secUnit.dataValues?.quantity,
        status: "Pembatalan Transaksi",
        type: "Pengurangan",
        quantity: Math.abs(
          totalIngredientQuantity - mainUnit?.dataValues?.convertion
        ),
        results: +currentSecUnitQuantity,
      });
      //update qtynya
      await Product_Detail.update(
        {
          quantity: +mainUnit.dataValues?.quantity + 1,
        },
        {
          where: {
            productId: itemRecipe?.dataValues?.ingredientProductId,
            isDefault: true,
          },
        }
      );
      await Product_Detail.update(
        {
          quantity: +currentSecUnitQuantity,
        },
        {
          where: {
            productId: itemRecipe?.dataValues?.ingredientProductId,
            isDefault: false,
          },
        }
      );
    }
    //kalau kurang brrti gaterjadi konversi
    if (
      totalIngredientQuantity + secUnit.dataValues?.quantity <
      mainUnit?.dataValues?.convertion
    ) {
      //update only sec unit
      // console.log("konversinya "+mainUnit?.dataValues?.convertion)
      await Product_History.create({
        productId: itemRecipe?.dataValues?.ingredientProductId,
        unit: secUnit.dataValues?.product_unit.name,
        initialStock: secUnit.dataValues?.quantity,
        status: "Pembatalan Transaksi",
        type: "Pengurangan",
        quantity: +totalIngredientQuantity,
        results: +totalIngredientQuantity + secUnit?.dataValues?.quantity,
      });

      await Product_Detail.update(
        {
          quantity: +totalIngredientQuantity + +secUnit?.dataValues?.quantity,
        },
        {
          where: {
            productId: itemRecipe?.dataValues?.ingredientProductId,
            isDefault: false,
          },
        }
      );
    }
  }
  //kalau totalIngredientQuantity >= main unit convertion
  //pasti terjadi konversi
  if (totalIngredientQuantity >= mainUnit?.dataValues?.convertion) {
    // sisa skrg 4, konversi 8, perlu 20, dulu sisa brp ? 0
    // sisa skrg 5, konversi 20, perlu 210 dulu sisa? 15
    const currentMainUnitQuantity = Math.floor(
      (totalIngredientQuantity + secUnit?.dataValues?.quantity) /
        mainUnit?.dataValues?.convertion
    );
    const currentSecUnitQuantity =
      (totalIngredientQuantity + secUnit?.dataValues?.quantity) %
      mainUnit?.dataValues?.convertion;
    // console.log("main unit qty : ",mainUnit.dataValues?.quantity)
    // console.log("sec unit qty",secUnit.dataValues?.quantity)
    await Product_History.create({
      productId: itemRecipe?.dataValues?.ingredientProductId,
      unit: mainUnit.dataValues?.product_unit.name,
      initialStock: mainUnit.dataValues?.quantity,
      status: "Pembatalan Transaksi",
      type: "Penambahan",
      quantity: currentMainUnitQuantity,
      results: +mainUnit.dataValues?.quantity + currentMainUnitQuantity,
    });
    await Product_History.create({
      productId: itemRecipe?.dataValues?.ingredientProductId,
      unit: secUnit.dataValues?.product_unit.name,
      initialStock: secUnit.dataValues?.quantity,
      status: "Pembatalan Transaksi",
      type:
        currentSecUnitQuantity > secUnit?.dataValues?.quantity
          ? "Penambahan"
          : "Pengurangan",
      quantity: Math.abs(
        currentSecUnitQuantity - secUnit?.dataValues?.quantity
      ),
      results: currentSecUnitQuantity,
    });
    //update qtynya
    await Product_Detail.update(
      {
        quantity: +mainUnit.dataValues?.quantity + currentMainUnitQuantity,
      },
      {
        where: {
          productId: itemRecipe?.dataValues?.ingredientProductId,
          isDefault: true,
        },
      }
    );
    await Product_Detail.update(
      {
        quantity: +currentSecUnitQuantity,
      },
      {
        where: {
          productId: itemRecipe?.dataValues?.ingredientProductId,
          isDefault: false,
        },
      }
    );
  }
}

module.exports = {
  cancelTransaction,
  cancelTransactionService
}