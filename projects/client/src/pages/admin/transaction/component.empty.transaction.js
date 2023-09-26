import { useNavigate } from "react-router-dom";
import Button from "../../../components/Button";

export default function EmptyTransaction() {
  const navigate = useNavigate()
  return (
    <div className="mt-12">
      <div className="flex justify-center items-center flex-col gap-1 h-full">
        <p>Tidak ada transaksi</p>
      </div>
    </div>
  )
}
