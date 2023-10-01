import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

export default function EmptyTransaction() {
  const navigate = useNavigate()
  return (
    <div className="mt-12">
      <div className="flex justify-center items-center flex-col gap-1 h-full">
        <h3 className="font-bold text-lg">Kamu belum memiliki transaksi</h3>
        <p>Yuk, mulai belanja dan penuhi kebutuhan kesehatanmu</p>

        <Button isButton isPrimary title={`Mulai Belanja`} className={`mt-4`} onClick={() => navigate("/products")}/>
      </div>
    </div>
  )
}
