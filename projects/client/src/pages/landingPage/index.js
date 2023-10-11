import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import Guarantee from "./components/guarantee.component"
import Produk from "./components/product.component"
import UnggahResep from "./components/unggah.resep.component"
import Categories from "./components/category.component";
import {getCategory,} from "../../store/slices/cat/slices.js";
import { getProducts } from "../../store/slices/product/slices";
import { getCart, totalProductCart } from "../../store/slices/cart/slices";
import Products from "../products";
import Footer from "../../components/Footer";

export default function LandingPage() {
  const { user, role, categories, products  } = useSelector(state => {
		return {
			user : state?.auth,
			role : state?.auth?.role,
			categories : state?.cat?.category,
			products : state?.products?.data,
		}
	})

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if(role === 1){
      navigate("/admin/products", "replace")
    }
  }, [role]);

  useEffect(()=>{
    dispatch(getCategory({page : 1}))
    dispatch(
        getProducts({
          page: 1,
          id_cat: "",
          product_name: "",
          sort_price: "",
          sort_name: "",
          limit:15,
        })
      )
    dispatch(getCart())
    dispatch(totalProductCart())
  },[])

  return (
    <div>
      <div className="container pt-24">
        <UnggahResep user={user}/>

        <div className="mt-4">
          <Categories categories={categories} />
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Promo Buy One Get One</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <Produk products={products} context={"bogo"}/>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Produk Diskon</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <Produk products={products} context="produkDiskon"/>
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Semua Produk</h3>
            <Button
              isLink
              path="/products"
              title="Lihat Semua"
              className="see-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <Produk products={products}/>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 justify-between gap-4 py-10 ">
          <Guarantee />
        </div>
      </div>

      <Footer />
    </div>
  );
}
