import Footer from "../../components/Footer";

export default function TentangKami() {
  return (
    <>
      <div className="container py-24 text-justify">
        <h3 className="title mt-4 mb-2">Selamat Datang di Apotech</h3>
        <p>
          Kami di Apotech bangga menyambut Anda ke toko online apotek kami. Sebagai mitra kesehatan Anda yang andal, kami berkomitmen untuk menyediakan layanan terbaik dalam kategori kesehatan dan kecantikan. Di Apotech, Anda akan menemukan berbagai produk kesehatan, obat-obatan, dan produk kecantikan berkualitas tinggi yang memenuhi standar keamanan dan keefektifan tertinggi.
        </p>

        <h3 className="title mt-4 mb-2">Siapa Kami?</h3> 
        <p>
          Kami adalah tim apoteker, tenaga kesehatan, dan profesional perawatan kesehatan yang berdedikasi untuk membantu Anda menjalani kehidupan yang lebih sehat. Dengan pengalaman bertahun-tahun dalam industri farmasi, kami memahami pentingnya akses mudah ke produk-produk kesehatan yang berkualitas. 

          Di Apotech, kami mengintegrasikan teknologi dan pengetahuan farmasi untuk memberikan solusi kesehatan yang mudah diakses dan terjangkau. Kami percaya bahwa setiap individu memiliki hak untuk mendapatkan produk kesehatan yang aman dan efektif, dan itulah mengapa kami berupaya keras untuk menjawab semua kebutuhan kesehatan Anda.
        </p>

        <div className="">
          <h3 className="title mt-4 mb-2">Kenapa Memilih Kami?</h3>
          <ul className="flex flex-col gap-1">
            <li className="list-disc list-inside">
              <span className="font-semibold">Kualitas Terbaik:</span> Kami hanya menyediakan produk-produk dari merek terpercaya dan memastikan kualitas setiap produk yang kami jual.
            </li>
            <li className="list-disc list-inside">
              <span className="font-semibold">Pelayanan Pelanggan:</span> Kami peduli tentang kesehatan Anda. Tim layanan pelanggan kami selalu siap membantu Anda dengan pertanyaan Anda.
            </li>
            <li className="list-disc list-inside">
              <span className="font-semibold">Keamanan Transaksi:</span> Keamanan transaksi online Anda adalah prioritas kami. Kami menggunakan teknologi terkini untuk melindungi data pribadi Anda.
            </li>
            <li className="list-disc list-inside">
              <span className="font-semibold">Pengiriman Cepat:</span> Kami memahami bahwa kesehatan adalah prioritas. Produk Anda akan sampai dengan cepat dan aman.
            </li>
          </ul>
        </div>

        

        <p className="mt-4">
          Kami berkomitmen untuk menjadi mitra kesehatan Anda yang tepercaya dan memberikan akses mudah ke produk kesehatan berkualitas. Kami sangat menghargai kepercayaan Anda kepada kami, dan kami berkomitmen untuk selalu memberikan pelayanan terbaik.
        </p>
        <p className="mt-4">
          Terima kasih telah memilih Apotech sebagai destinasi Anda untuk semua kebutuhan kesehatan Anda. Kami berharap Anda menemukan pengalaman berbelanja yang menyenangkan dan bermanfaat. Jika Anda memiliki pertanyaan atau memerlukan bantuan, jangan ragu untuk menghubungi tim kami.
        </p>

        <p className="mt-4">Salam sehat,</p>
        <h3 className="subtitle">Tim Apotech</h3>
      </div>

      <Footer />
    </>
  )
}
