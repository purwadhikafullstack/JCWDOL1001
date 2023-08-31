import React from "react"
import Button from "../../../components/Button"
import { useNavigate } from "react-router-dom"

export default function ProdukDiskon({ id, name, price, image, stock, discount }) {
  const handleCart = () => {
    alert(`Produk ${id} berhasil ditambahkan ke keranjang!`)
  };

  const navigate = useNavigate()

  

  return (
    <div
      className="group flex cursor-pointer flex-col gap-2 rounded-lg border p-3 text-dark shadow-lg"
      onClick={() => navigate(`/products/${id}`)}
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-primary">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover duration-300 group-hover:scale-110"
        />
      </div>

      <h3 className="text-sm font-bold uppercase duration-300 group-hover:text-primary lg:text-base">
        {name}
      </h3>
      {discount ? (
        <div className="mt-auto flex items-center gap-2">
          <span className="rounded-md border border-red-400 px-2 py-1 text-xs font-semibold text-red-400">
            {discount}%
          </span>
          <h3 className="text-sm text-slate-400 line-through">
            Rp. {price}
          </h3>
        </div>
      ) : (
        <div className="mt-auto" />
      )}
      <h3 className="font-bold">
        Rp.{" "}
        {discount
          ? (100 - discount) * price / 100
          : price}
      </h3>
      <Button
        isButton
        isPrimaryOutline
        isBLock
        title="Keranjang"
        className="font-semibold"
        onClick={handleCart}
      />
    </div>
  );
}