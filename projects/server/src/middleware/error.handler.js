const SOMETHING_WENT_WRONG = "Terjadi kesalahan";
const EMAIL_NOT_FOUND = "Email tidak ditemukan";
const EMAIL_HAS_BEEN_USED = "Email sudah digunakan sebelumnya.";
const USER_NOT_FOUND = "Pengguna tidak ditemukan";
const INCORRECT_PASSWORD = "Kata sandi salah";
const BAD_REQUEST = "Permintaan tidak valid";
const LINK_EXPIRED = "Sudah tidak valid. Kode OTP Anda telah kedaluwarsa. Silakan minta kode OTP baru di halaman sebelumnya.";
const IMAGE_NOT_FOUND = "Tidak ada gambar dalam file, coba lagi.";
const CATEGORY_NOT_FOUND = "Kategori tidak ditemukan.";
const CATEGORY_ALREADY_EXISTS = "Sudah ada kategori yang sama dalam daftar, atau pernah ada kategori dengan nama yang sama.";
const PRODUCT_NOT_FOUND = "Produk tidak ditemukan.";
const PRODUCT_ALREADY_EXISTS = "Sudah ada produk yang sama dalam daftar!";
const PRODUCT_ALREADY_HAS_DEFAULT_UNIT = "Produk sudah memiliki unit default dalam daftar!";
const PRODUCT_UNIT_ALREADY_EXISTS = "Unit produk sudah ada dalam daftar!";
const PRODUCT_UNIT_NAME_ALREADY_EXISTS = "Unit produk dengan nama tersebut sudah ada dalam daftar!";
const PRODUCT_UNIT_EXCEED_LIMIT = "Unit produk dibatasi maksimal 2!";
const REQUEST_EXCEED_LIMIT = "Anda tidak dapat meminta lebih dari jumlah persediaan produk!";
const PRODUCT_UNIT_NOT_FOUND = "Unit produk tidak ditemukan.";
const CANNOT_DELETE_DEFAULT_PRODUCT_UNIT = "Unit produk default tidak dapat dihapus!";
const NO_CHANGES = "Tidak ada perubahan yang dilakukan";
const DEFAULT_UNIT_UNAVAILABLE = "Unit produk default kehabisan stok";
const SECONDARY_PRODUCT_UNIT_NOT_FOUND = "Unit produk sekunder tidak ditemukan! Harap tambahkan unit sekunder terlebih dahulu";
const PRODUCT_DONT_HAVE_DEFAULT_UNIT = "Nilai default produk ini belum dideklarasikan, harap deklarasikan terlebih dahulu";
const INPUT_MORE_THAN_STOCK = "Persediaan yang tersedia kurang dari waktu konversi";
const PRODUCT_HAS_CATEGORY = "Kategori yang ingin Anda hapus memiliki Produk yang menggunakannya.";
const ADDRESS_NOT_FOUND = "Alamat tidak ditemukan";
const ITEM_NOT_ENOUGH = "Salah satu atau beberapa item memiliki stok kurang dari yang Anda ingin beli.";
const DISCOUNT_NOT_FOUND = "Diskon tidak ditemukan";
const DISCOUNT_NAME_ALREADY_EXIST = "Nama diskon sudah ada";
const VOUCHER_CODE_EMPTY = "Kode voucher tidak boleh kosong";
const VOUCHER_NEED_PRODUCT = "Voucher Beli Satu Gratis Satu harus memiliki produk";
const VOUCHER_NEED_AMOUNT = "Jumlah potongan dibutuhkan";
const DISCOUNT_IS_EXPIRED = "Diskon sudah kedaluwarsa";
const NOT_MEET_MINIMUM_TRANSACTION = "Tidak memenuhi transaksi minimum";
const NOT_NEED_CODE = "Produk diskon tidak dapat memiliki kode diskon";

const NO_STOCK = "Stok tidak mencukupi untuk produk yang diinginkan";
const PRODUCT_ALREADY_CHECKEDOUT = "Pesanan yang diinginkan sudah diperiksa";
const TRANSACTION_NOT_FOUND = "Transaksi tidak ditemukan";
const ONLY_ONCE = "Tautan ini hanya berlaku untuk 1 pengiriman.";
const DATA_NOT_FOUND = "Data tidak ditemukan";
const CANNOT_DELETE_QUESTION = "Pertanyaan melebihi waktu penghapusan";
const CANNOT_DELETE_ANSWERED_QUESTION = "Pertanyaan yang sudah dijawab tidak dapat dihapus";
const PRODUCT_ALREADY_HAVE_DISCOUNT = "Produk sudah memiliki diskon";

const DEFAULT_ERROR_STATUS = 500
const BAD_REQUEST_STATUS = 400
const NOT_FOUND_STATUS = 404
const LINK_EXPIRED_STATUS = 410
const INVALID_CREDENTIALS = "Kredensial tidak valid";
const INVALID_CREDENTIALS_OTP = "Kredensial tidak valid untuk OTP. Harap periksa OTP Anda";

function errorHandler (error, req, res, next) {
    if (error?.name === "SequelizeValidationError") {
        return res.status(BAD_REQUEST_STATUS)
            .json(
                { message : error?.errors?.[0]?.message }
            )
    }

    const message = error?.message || SOMETHING_WENT_WRONG;
    const status = error?.status || DEFAULT_ERROR_STATUS;
    res.status(status).json({ 
        type : "error", 
        status, 
        message
    });
}

module.exports = {
    errorHandler,
    SOMETHING_WENT_WRONG,
    EMAIL_NOT_FOUND,
    EMAIL_HAS_BEEN_USED,
    INCORRECT_PASSWORD,
    BAD_REQUEST,
    DEFAULT_ERROR_STATUS,
    BAD_REQUEST_STATUS,
    NOT_FOUND_STATUS,
    INVALID_CREDENTIALS,
    INVALID_CREDENTIALS_OTP,
    LINK_EXPIRED,
    LINK_EXPIRED_STATUS,
    IMAGE_NOT_FOUND,
    CATEGORY_NOT_FOUND,
    CATEGORY_ALREADY_EXISTS,
    PRODUCT_NOT_FOUND,
    PRODUCT_ALREADY_EXISTS,
    PRODUCT_ALREADY_HAS_DEFAULT_UNIT,
    PRODUCT_UNIT_ALREADY_EXISTS,
    PRODUCT_UNIT_NAME_ALREADY_EXISTS,
    PRODUCT_UNIT_EXCEED_LIMIT,
    CANNOT_DELETE_DEFAULT_PRODUCT_UNIT,
    NO_CHANGES,
    DEFAULT_UNIT_UNAVAILABLE,
    SECONDARY_PRODUCT_UNIT_NOT_FOUND,
    PRODUCT_UNIT_NOT_FOUND,
    PRODUCT_DONT_HAVE_DEFAULT_UNIT,
    INPUT_MORE_THAN_STOCK,
    PRODUCT_HAS_CATEGORY,
    USER_NOT_FOUND,
    REQUEST_EXCEED_LIMIT,
    ADDRESS_NOT_FOUND,
    DISCOUNT_NOT_FOUND,
    DISCOUNT_NAME_ALREADY_EXIST,
    USER_NOT_FOUND,
    VOUCHER_CODE_EMPTY,
    VOUCHER_NEED_PRODUCT,
    VOUCHER_NEED_AMOUNT,
    NO_STOCK,
    PRODUCT_ALREADY_CHECKEDOUT,
    ONLY_ONCE,
    TRANSACTION_NOT_FOUND,
    ITEM_NOT_ENOUGH,
    DATA_NOT_FOUND,
    CANNOT_DELETE_QUESTION,
    CANNOT_DELETE_ANSWERED_QUESTION,
    PRODUCT_ALREADY_HAVE_DISCOUNT,
    DISCOUNT_IS_EXPIRED,
    NOT_MEET_MINIMUM_TRANSACTION,
    NOT_NEED_CODE
}