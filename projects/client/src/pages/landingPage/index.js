import Button from "../../components/Button"
import Guarantee from "./components/guarantee.component"
import ProdukDiskon from "./components/product.diskon.component"
import UnggahResep from "./components/unggah.resep.component"

export default function LandingPage() {
  return (
    <div>
      <div className="container pt-24">
        <UnggahResep/>

        <div className="mt-4">
          <Button
              isLink
              path="/"
              className="flex w-48 flex-shrink-0 cursor-pointer flex-col items-center justify-center rounded-lg px-3 py-3 shadow-lg hover:bg-slate-100 md:py-6"
            >
              <div className="h-8 w-8 md:h-10 md:w-10">
                category pic
              </div>
              <p className="text-sm font-bold text-dark md:text-base">
                category.name
              </p>
            </Button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <h3 className="title text-2xl">Produk Diskon</h3>
            <Button
              isLink
              path="/products"
              title="Lihat Semua"
              className="see-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            <ProdukDiskon/>
          </div>
        </div>

        <div className="grid w-full grid-cols-1 justify-between gap-4 py-10 ">
          <Guarantee />
        </div>
      </div>
    </div>
  );
}
