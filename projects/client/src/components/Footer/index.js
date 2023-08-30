import { IoIosMail, IoLogoWhatsapp,IoLogoInstagram } from "react-icons/io"
import Button from "../Button"
import "./index.css"

export default function Footer() {
  const footerItems = [
    { title: "FAQ", path: "/faq" },
    { title: "Tentang Kami", path: "/tentang-kami" },
    { title: "Kebijakan Privasi", path: "/kebijakan-privasi" },
    { title: "Syarat & Ketentuan", path: "/syarat-ketentuan" },
  ];
  return (
    <div className="fixed bottom-9 w-full border-t-2 ml-10 lg:ml-0">
      <div className="container grid grid-cols-1 gap-x-20 gap-y-8 pb-24 pt-8 lg:grid-cols-4 lg:pb-4">
        <div>
          LOGO
          <img 
            src="" 
            alt="" 
            className="mb-6 w-48" 
          />

          <Button 
            isLink 
            path="/instagram"
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              <IoLogoInstagram className="text-xl" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                @test
              </span>
            </div>
            
          </Button>

          <Button 
            isLink 
            path="/wa"
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              <IoLogoWhatsapp className="text-2xl" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                +62-8123-4567-890
              </span>
            </div>

          </Button>

          <Button 
            isLink 
            path="/mail"
            className="footer-item flex items-center gap-x-2"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              <IoIosMail className="text-2xl" />
            </div>

            <div className="flex flex-col">
              <span className="text-sm lg:text-base font-normal">
                contact@test.com
              </span>
            </div>

          </Button>          
        </div>

        <div className="flex flex-col mt-[7px]">
          {footerItems.map((item, index) => (
            <Button
              key={index}
              isLink
              path={item.path}
              title={item.title}
              className="footer-item mt-1"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
