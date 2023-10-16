//TODO : use these logic to proceed reverse stock
      //get transaction list
      const reverseList = await Transaction_Detail.findAll({where : {
        transactionId : transactionId,
      }})
      console.log(reverseList[0])
      // //product check
      await Promise.all(
        reverseList.map(async (item) =>{ 
          const {productId, quantity} = item
          //seandainya di product resep, ada barangnya
          const listRecipe = await Product_Recipe.findAll({where : 
          {
            productId : productId
          }})

          //produk satuan
          if(listRecipe.length === 0){
           
          const defaultUnit = await Product_Detail.findOne({
            where : {
              productId : productId,
              isDefault : true
            },
            include :[ 
              {
                model : Product_Unit,
              }
            ]
          })

          await Product_History.create({
            productId : productId,
            unit : defaultUnit.dataValues?.product_unit.name,
            initialStock : defaultUnit.dataValues?.quantity,
            status : "Pembatalan Transaksi",
            type : "Penambahan",
            quantity : quantity,
            results : +defaultUnit.dataValues?.quantity + quantity
          })
          //update qtynya

          await Product_Detail.update({
            quantity : +defaultUnit?.dataValues?.quantity + quantity
          },{
            where : {
              productId : productId,
              isDefault : true
            }
          })
        }
        //stock yang berubah hanya komposisi. obat racik = kumpulan produk sec unit
          if(listRecipe.length !== 0){
            await Promise.all(
              listRecipe.map(async (itemRecipe) =>{
                const mainUnit = await Product_Detail.findOne({
                  where : {
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    isDefault : true
                  },
                  include :[ 
                    {
                      model : Product_Unit,
                    }
                  ]
                })
                const secUnit = await Product_Detail.findOne({
                  where : {
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    isDefault : false
                  },
                  include :[
                  {
                    model : Product_Unit,
                  }]
                })
                //seandainya awalnya stock ada 12 sec, kepake cmn 4
                //quantity di transaksi x quantity di resep produknya =  total ingredients yang kepakai
                //cth : kejual 3 biji, 1 biji perlu 3 butir panadol
                //brrti kepake 9 butir
                //cth cmn perlu 8, brrti kepake 3 main, sisa 1
                const totalIngredientQuantity = quantity * itemRecipe?.dataValues?.quantity

                //stock obat racik : 1 quantity untuk obat raciknya
                //ingredient : 2 , convertion 2
                //sec ingredient > convertion
                console.log("nilainya ",totalIngredientQuantity)
                //seandainya totalIngredientQuantity < main unit convertion?


                if(totalIngredientQuantity < mainUnit?.dataValues?.convertion){
                //cek dlu apakah totalIngredientQuantity + secUnit.quantity >= convertion
                //kalau iya brrti terjadi konversi; cth : total 7, sec unit 1 conv 8, brrti awalnya ada 6

                if(totalIngredientQuantity + secUnit.dataValues?.quantity >= mainUnit?.dataValues?.convertion){
                //update both unit
                const currentSecUnitQuantity = totalIngredientQuantity + secUnit.dataValues?.quantity - mainUnit?.dataValues?.convertion
                await Product_History.create({
                  productId : itemRecipe?.dataValues?.ingredientProductId,
                  unit : mainUnit.dataValues?.product_unit.name,
                  initialStock : mainUnit.dataValues?.quantity,
                  status : "Pembatalan Transaksi",
                  type : "Penambahan",
                  quantity : 1,
                  results : +mainUnit.dataValues?.quantity + 1
                })
                await Product_History.create({
                  productId : itemRecipe?.dataValues?.ingredientProductId,
                  unit : secUnit.dataValues?.product_unit.name,
                  initialStock : secUnit.dataValues?.quantity,
                  status : "Pembatalan Transaksi",
                  type : "Pengurangan",
                  quantity : Math.abs(totalIngredientQuantity - mainUnit?.dataValues?.convertion),
                  results : +currentSecUnitQuantity
                })
                //update qtynya
                await Product_Detail.update({
                  quantity : +mainUnit.dataValues?.quantity + 1
                },{
                  where : {
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    isDefault : true
                  }
                })
                await Product_Detail.update({
                  quantity : +currentSecUnitQuantity
                },{
                  where : {
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    isDefault : false
                  }
                })

                }
                //kalau kurang brrti gaterjadi konversi
                else{
                //update only sec unit
                await Product_History.create({
                  productId : itemRecipe?.dataValues?.ingredientProductId,
                  unit : secUnit.dataValues?.product_unit.name,
                  initialStock : secUnit.dataValues?.quantity,
                  status : "Pembatalan Transaksi",
                  type : "Pengurangan",
                  quantity : +totalIngredientQuantity,
                  results :  +totalIngredientQuantity + secUnit?.dataValues?.quantity
                })

                await Product_Detail.update({
                  quantity :  +totalIngredientQuantity + +secUnit?.dataValues?.quantity
                },{
                  where : {
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    isDefault : false
                  }
                })

                }
                }
                //kalau totalIngredientQuantity >= main unit convertion
                //pasti terjadi konversi
                if(totalIngredientQuantity >= mainUnit?.dataValues?.convertion){
                  // sisa skrg 4, konversi 8, perlu 20, dulu sisa brp ? 0
                  // sisa skrg 5, konversi 20, perlu 210 dulu sisa? 15
                  const currentMainUnitQuantity = Math.floor((totalIngredientQuantity + secUnit?.dataValues?.quantity) / mainUnit?.dataValues?.convertion)
                  const currentSecUnitQuantity = (totalIngredientQuantity + secUnit?.dataValues?.quantity) % mainUnit?.dataValues?.convertion
                  console.log("main unit qty : ",mainUnit.dataValues?.quantity)
                  console.log("sec unit qty",secUnit.dataValues?.quantity)
                  await Product_History.create({
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    unit : mainUnit.dataValues?.product_unit.name,
                    initialStock : mainUnit.dataValues?.quantity,
                    status : "Pembatalan Transaksi",
                    type : "Penambahan",
                    quantity : currentMainUnitQuantity,
                    results : +mainUnit.dataValues?.quantity + currentMainUnitQuantity
                  })
                  await Product_History.create({
                    productId : itemRecipe?.dataValues?.ingredientProductId,
                    unit : secUnit.dataValues?.product_unit.name,
                    initialStock : secUnit.dataValues?.quantity,
                    status : "Pembatalan Transaksi",
                    type : currentSecUnitQuantity > secUnit?.dataValues?.quantity ? "Penambahan" : "Pengurangan",
                    quantity : Math.abs(currentSecUnitQuantity - secUnit?.dataValues?.quantity),
                    results : currentSecUnitQuantity
                  })
                  //update qtynya
                  await Product_Detail.update({
                    quantity : +mainUnit.dataValues?.quantity + currentMainUnitQuantity
                  },{
                    where : {
                      productId : itemRecipe?.dataValues?.ingredientProductId,
                      isDefault : true
                    }
                  })
                  await Product_Detail.update({
                    quantity : +currentSecUnitQuantity
                  },{
                    where : {
                      productId : itemRecipe?.dataValues?.ingredientProductId,
                      isDefault : false
                    }
                  })
                } 
                

              })
            )
          }
      
      }))