import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createTransaction, getCheckoutProducts } from "../../../../store/slices/transaction/slices";
import Item from "../../../../components/Item";

export default function CheckoutPage(){

    const dispatch = useDispatch();
    const [payment, setPayment] = useState(null);

    const {cart, address} = useSelector((state)=>{
        return {
            cart : state?.transaction?.cart,
        }
    })

    useEffect(()=>{
        dispatch(getCheckoutProducts())
    },[])

    const PaymentMethod = () => {

    }

    return(
        <>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <div className="mt-4 flex flex-col items-left justify-left pb-2">
                    <div>
                        <h1 className="text-3xl font-semibold w-full border-b-2 mb-5 pb-2">Checkout</h1>
                    </div>
                    <div className="mb-4 border-b-2">
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Order Details</h3>
                        <div className="flex flex-col gap-2">
                        {
                        cart ?
                        cart.map((cart, index)=>{
                            return(<Item
                                key={index}
                                productName={cart.cartList.productName}
                                productPrice={cart.cartList.productPrice}
                                productPicture={cart.cartList.productPicture}
                                quantity={cart.quantity}
                            />)
                            
                        }) :
                        <h1> Your cart is empty as your wallet.</h1> 
                        }</div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Shipping</h3>
                        <div className="w-full bg-slate-200 flex flex-row items-center p-4">

                        </div>
                    </div>
                    <div className="mb-5 pb-2">
                        <h3 className="text-2xl font-semibold w-full">Payment Method</h3>
                            <select value={payment} className="text-xl border-2 bg-green-200 rounded-lg md:rounded-md" onChange={(e)=>setPayment(e.target.value)}>
                                <option disabled="true">DigitalPayment</option>
                                <option value={"Gopay"}>Gopay</option>
                                <option value={"Ovo"}>OVO</option>
                                <option disabled="true">BankTransfer</option>
                                <option value={"BCA"}>BCA</option>
                                <option value={"Mandiri"}>Mandiri</option>
                            </select>
                    </div>
                    <div>
                        <button className="" type="button">Checkout</button>
                    </div>
                   
                </div>
            </div>
        </>
    )
}