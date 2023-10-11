import { IoIosMail, IoLogoWhatsapp,IoLogoInstagram } from "react-icons/io"
import Button from "../Button"
import "./index.css"

export default function Footer() {
  const footerItems = [
    { title: "Tentang Kami", path: "/tentang-kami" },
    { title: "Kebijakan Privasi", path: "/kebijakan-privasi" },
    { title: "Syarat & Ketentuan", path: "/syarat-ketentuan" },
  ]
  return (
    <div className="w-full border-t-2">
      <div className="container grid grid-cols-1 gap-x-20 gap-y-6 pb-24 pt-8 lg:grid-cols-3 lg:pb-4">
        <div className="">
          <div>
              <a 
                  href="/" 
                  className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-dark"
              >
              <span className="absolute block h-2 w-6 rounded-full bg-dark"></span>
              <span className="absolute rotate-90 block h-2 w-6 rounded-full bg-primary"></span>
              <span className="absolute block h-2 w-6 rounded-full bg-dark opacity-40"></span>
              <span className="ml-8 font-poppins">Apotech</span>
              </a>
          </div>

          <p className="text-justify mt-2">Apotech adalah penyedia terkemuka dalam industri apotek online dengan komitmen kami dalam memenuhi kebutuhan kesehatan Anda.</p>
        </div>

        <div className="flex flex-col mt-[7px]">
          {footerItems.map((item, index) => (
            <Button
              key={index}
              isLink
              path={item.path}
              title={item.title}
              className="footer-item"
            />
          ))}
        </div>

        <div className="">
          <Button 
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex w-8 items-center justify-center">
              <IoLogoInstagram className="text-[1.75rem]" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                @apotech
              </span>
            </div>
          </Button>

          <Button 
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex w-8 items-center justify-center">
              <IoLogoWhatsapp className="text-2xl" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                +62-8123-4567-890
              </span>
            </div>
          </Button>

          <Button 
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex w-8 items-center justify-center">
              <IoIosMail className="text-2xl" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                support@apotech.com
              </span>
            </div>
          </Button>  
        </div>
      </div>

      <div className="w-full bg-primary py-2 text-center text-white">
        © 2023 Apotech
      </div>
    </div>
  );
}
