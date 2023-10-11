import Button from "../../components/Button";
import Footer from "../../components/Footer";

export default function SyaratKetentuan() {
  return (
    <>
      <div className="container py-24">
        <h3 className="title">Syarat dan Ketentuan</h3>
        <p>
          Dengan menggunakan situs web kami, Anda menyetujui untuk mematuhi dan terikat oleh Syarat dan Ketentuan yang tercantum di bawah ini:
        </p>

        <h3 className="font-bold mt-4">Ketentuan Penggunaan</h3>
        <p>
          Anda setuju untuk menggunakan situs kami sesuai dengan hukum yang berlaku.
        Anda bertanggung jawab atas konten yang Anda unggah atau bagikan di situs kami.
        </p>

        <h3 className="font-bold mt-4">Privasi</h3>
        <p>
          Kami menghormati privasi Anda. Silakan merujuk ke{" "}
          <Button isLink path="/kebijakan-privasi" className="underline">Kebijakan Privasi</Button>
          {" "}kami untuk memahami bagaimana kami mengelola data pribadi.
        </p>

        <h3 className="font-bold mt-4">Hak Cipta</h3>
        <p>
          Konten yang kami sediakan di situs ini dilindungi oleh hak cipta. Tidak diperkenankan menggandakan atau mendistribusikannya tanpa izin.
        </p>

        <h3 className="font-bold mt-4">Larangan</h3>
        <p>
          Tindakan spam, penipuan, atau kegiatan ilegal lainnya tidak diperbolehkan di situs kami.
        </p>

        <h3 className="font-bold mt-4">Pembatalan Pesanan</h3>
        <p>
          Kami berhak membatalkan pesanan jika terdapat kesalahan harga atau ketersediaan produk.
        </p>

        <h3 className="font-bold mt-4">Ganti Rugi</h3>
        <p>
          Kami tidak bertanggung jawab atas kerugian atau cedera yang timbul akibat penggunaan informasi dari situs kami.
        </p>

        <h3 className="font-bold mt-4">Perubahan Syarat dan Ketentuan</h3>
        <p>
          Syarat dan Ketentuan ini dapat diperbarui tanpa pemberitahuan. Pastikan Anda membacanya secara berkala.
        </p>

        <h3 className="font-bold mt-4">Kontak Kami</h3>
        <p>
          Untuk pertanyaan atau klarifikasi lebih lanjut, silakan hubungi kami melalui informasi kontak yang tersedia di situs kami.
        Dengan menggunakan situs kami, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui Syarat dan Ketentuan yang tercantum di atas. Jika Anda tidak setuju dengan syarat-syarat ini, harap tidak menggunakan situs kami.
        </p>
      </div>

      <Footer />
    </>
  )
}
