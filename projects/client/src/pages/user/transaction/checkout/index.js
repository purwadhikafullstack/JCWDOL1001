import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createTransaction, getCheckoutProducts } from "../../../../store/slices/transaction/slices";
import Item from "../../../../components/Item";
import Button from "../../../../components/Button";
import formatNumber from "../../../../utils/formatNumber";
import { useLocation, useNavigate } from "react-router-dom";
import LogoBca from "../../../../assets/logo-bca.png";
import LogoMandiri from "../../../../assets/logo-mandiri.png";
import ShippingAddress from "../../../../components/Shipping/component.address";
import ShippingCost from "../../../../components/Shipping/component.shipping";
import DiscountChecker from "../../../../components/Discount Checker";
import moment from "moment"

export default function CheckoutPage(){

    const dispatch = useDispatch();
    const navigate = useNavigate();
    let subTotal = 0;
    const location = useLocation();
    const {cart,address} = useSelector((state)=>{
        return {
            cart : state?.transaction?.cart,
            address : state?.auth?.address,
            listDiscount: state?.discount?.listDiscount
        }
    })

    const [selectedAddress, setSelectedAddress] = useState([])
    const [selectedShipping, setShipping] = useState([])
    const [selectedDiscount, setDiscount] = useState(null)
    
    useEffect(()=>{
        dispatch(getCheckoutProducts())
        setSelectedAddress(address?.find((address)=>{return address?.isPrimary === 1}))
    },[])

    const PaymentMethod = () => {
                return(
                    <div className="flex flex-row">
                    <div class="m-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <img src={LogoBca} className=" w-48 h-24 mx-12 items-center justify-center"></img>
                            <h3>Please transfer to BCA Bank Account</h3>
                            <h1 className="text-4xl font-bold">091 802 3981</h1>
                            <h2 className="text-2xl font-semibold">APOTEK PRIMA JASA</h2>
                        </div>
                    </div>
                    <div class="m-4 overflow-x-auto w-96 shadow-md sm:rounded-lg py-8 bg-slate-100 text-black items-center text-center">
                        <div>
                            <img src={LogoMandiri} className="w-48 h-24 mx-12 items-center justify-center"></img>
                            <h3>Please transfer to Mandiri Bank Account</h3>
                            <h1 className="text-4xl font-bold">1234 567 890</h1>
                            <h2 className="text-2xl font-semibold">APOTEK PRIMA MANDIRI</h2>
                        </div>
                    </div>
                    </div>
                )
        }

    const checkOut = () => {
        dispatch(createTransaction({transport : selectedShipping?.cost, totalPrice : (+subTotal*1), addressId : selectedAddress.addressId, discountId : selectedDiscount?.discountId}));
        // navigate("/user/transaction");
    }

    return(
        <>
            <div className="container py-24 lg:ml-[calc(5rem)] lg:px-8">
                <div className="mt-4 flex flex-col items-left justify-left pb-2">
                    <div>
                        <h1 className="text-3xl font-semibold w-full border-b-2 mb-5 pb-2">Checkout</h1>
                    </div>
                    <div className="mb-10">
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Shipping</h3>
                        <div className="flex gap-20 items-center">
                            <ShippingAddress listAddress={address} selectedAddress={selectedAddress} setSelectedAddress={setSelectedAddress} />
                            <ShippingCost selectedAddress={selectedAddress} setShipping={setShipping} />
                        </div>
                    </div>
                    <div className="mb-4 border-b-2">
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Order Details</h3>
                        <div className="flex flex-col gap-2 border-green-300">
                        {
                        cart ?
                        cart.map((cart, index)=>{
                            subTotal += cart.cartList.productPrice * cart.quantity;
                            return(<Item
                                key={index}
                                productName={cart.cartList.productName}
                                productPrice={cart.product_detail.productDiscount[0]?.endingPrice ? cart.product_detail.productDiscount[0]?.endingPrice : cart.cartList.productPrice}
                                productPicture={cart.cartList.productPicture}
                                quantity={cart.quantity}
                            />)
                            
                        }) :
                        <h1> Your cart is empty as your wallet.</h1> 
                        }</div>
                    </div>
                    <div className="mb-5 pb-2">
                        <h3 className="text-2xl font-semibold w-full">Payment Method</h3>
                            {/*<select value={payment} className="text-xl border-2 bg-green-200 rounded-lg md:rounded-md" onChange={(e)=>setPayment(e.target.value)}>
                                <option value={null}>Please choose your payment Method</option>
                                <option disabled="true">BankTransfer</option>
                                <option value={"BCA"}>BCA</option>
                                <option value={"Mandiri"}>Mandiri</option>
                        </select>*/}
                            {
                                //payment && 
                                PaymentMethod()
                            }
                    </div>                    
                    <div className="flex flex-col gap-2 my-10">
                        <h3 className="text-2xl font-semibold w-full border-b-2 mb-5 pb-2">Kode Kupon</h3>
                        <DiscountChecker setDiscount={setDiscount} subTotal={subTotal} selectedDiscount={selectedDiscount}
                        />
                    </div>
                    <div className="text-2xl font-semibold w-auto border mb-5 pb-2">
                        <h1>Sub Total : Rp. {formatNumber(subTotal)}</h1>
                        <h1>Total Diskon : (Rp. {!selectedDiscount ? 0 : 
                            formatNumber(`${selectedDiscount?.isPercentage ? selectedDiscount?.discountAmount/100 *subTotal : selectedDiscount?.discountAmount}`) })
                        </h1>
                        <h1>Total Ongkir : Rp. {selectedShipping?.length === 0 ? 0 : `${formatNumber(selectedShipping?.cost)}` }</h1>
                        <h1>Total Pembayaran : Rp. {formatNumber(subTotal + (selectedShipping.length === 0 ? 0 : +selectedShipping.cost) - (!selectedDiscount ? 0 : selectedDiscount?.isPercentage ? +selectedDiscount?.discountAmount/100 *subTotal : +selectedDiscount?.discountAmount))}</h1>
                        {/* {
                            shipping && <><h1>Shipping cost : Rp. {formatNumber(shipping)}</h1>
                            <h1>Grand total : Rp. {formatNumber(subTotal*1 + shipping*1)}</h1></>
                        } */}
                        <Button className="" isPrimary isButton title={`Check Out!`} onClick={checkOut}/>
                    </div>
                </div>
            </div>
        </>
    )
}