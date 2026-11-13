# Sistem Review Kantin (KantinHub) - Tugas 4

Aplikasi web Sistem Review Kantin kampus yang mengintegrasikan frontend React (TypeScript) dengan backend REST API Express.js, SQL Server, dan autentikasi berbasis JSON Web Token (JWT).

---

## 🛠️ Teknologi yang Digunakan

### Frontend
- **Framework**: React 19 (TypeScript)
- **Bundler & Dev Server**: Vite
- **Routing**: React Router v7
- **HTTP Client**: Axios (dengan request interceptor untuk JWT Bearer token)
- **Styling**: Modern CSS dengan tema kuliner/kantin (*warm culinary theme*), responsif, dan state indicator yang jelas

### Backend
- **Runtime**: Node.js dengan Express.js
- **Database**: Microsoft SQL Server
- **ORM**: Drizzle ORM
- **Validasi**: Zod Schema Validation
- **Keamanan**: JWT Authentication & Role-based Authorization (`admin`, `owner`, `customer`)

---

## 📋 Fitur yang Diimplementasikan

### 1. Menampilkan Data Kantin
- **Daftar Warung Kantin** (`GET /stalls`): Menampilkan kartu warung dengan info nama, kategori, lokasi, rating bintang, jumlah review, dan badge kantin populer.
- **Detail Warung Kantin** (`GET /stalls/:id` & `GET /stalls/:id/menus`): Menampilkan detail lengkap kantin beserta daftar menu makanan/minuman yang tersedia.
- **Pencarian Real-Time**: Pencarian berdasarkan nama warung kantin via query `search`.
- **Filter Kategori**: Filter berdasarkan kategori (Makanan Berat, Minuman, Snack, Nasi, Mie, dll.) via query `category`.
- **Paginasi**: Kontrol halaman dinamis (`page` & `limit`) lengkap dengan tombol halaman, sebelumnya, dan selanjutnya.
- **Status Tampilan**: Loading indicator (spinner), empty state yang informatif saat tidak ada data atau hasil pencarian nihil, dan error state dengan tombol coba lagi.

### 2. Operasi CRUD Data Warung
- **Create** (`POST /stalls`): Hanya untuk pengguna dengan role `owner` dan `admin`.
- **Read**: Dapat diakses oleh semua pengguna (publik, customer, owner, admin).
- **Update** (`PUT /stalls/:id`):
  - `admin`: Dapat mengubah data warung mana pun.
  - `owner`: Hanya dapat mengubah warung miliknya sendiri (`stall.ownerId === user.id`).
  - `customer` / `public`: Tidak memiliki akses edit.
- **Delete** (`DELETE /stalls/:id`):
  - `admin`: Memiliki hak eksklusif untuk menghapus kantin.
  - `owner`: Tidak memiliki akses hapus sesuai ketentuan backend (`authorize("admin")`).

### 3. Autentikasi & Otorisasi Pengguna
- **Registrasi** (`POST /auth/register`): Pendaftaran akun baru dengan validasi nama (min 3 karakter), email valid, dan password (min 8 karakter).
- **Login** (`POST /auth/login`): Autentikasi pengguna menggunakan email dan password, token JWT disimpan di `localStorage`.
- **Profil Pengguna** (`GET /auth/me`): Verifikasi sesi login aktif dan pengambilan profil pengguna saat aplikasi dimuat.
- **Logout**: Menghapus token dari `localStorage` dan mereset status autentikasi di seluruh aplikasi.

---

## 🚀 Panduan Instalasi dan Menjalankan Aplikasi

### 1. Persiapan Backend
Masuk ke direktori `Backend`:
```bash
cd Backend
npm install
```

Salin file konfigurasi environment:
```bash
cp .env.example .env
```
Sesuaikan isi `.env` dengan kredensial database SQL Server dan JWT Secret Anda:
```env
DB_SERVER=localhost
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=YourStrongPassword!
DB_NAME=review_kantin
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true

JWT_SECRET=supersecretjwtkey123
JWT_EXPIRES_IN=2h
BCRYPT_SALT_ROUNDS=10
```

Jalankan backend server:
```bash
npm run dev
```
Backend akan berjalan di `http://localhost:3000`.

---

### 2. Persiapan Frontend
Buka terminal baru dan masuk ke direktori `Frontend`:
```bash
cd Frontend
npm install
```

Salin file environment:
```bash
cp .env.example .env
```
Pastikan `VITE_API_URL` mengarah ke backend:
```env
VITE_API_URL=http://localhost:3000/api/v1
```

Jalankan frontend dev server:
```bash
npm run dev
```
Buka browser pada alamat yang ditampilkan (biasanya `http://localhost:5173`).

Untuk melakukan pengecekan build dan lint:
```bash
npm run lint   # Memastikan tidak ada error ESLint
npm run build  # Memastikan kompilasi TypeScript dan bundle Vite berhasil
```

---

## 🧪 Skenario Pengujian Manual (Checklist Pengujian Wajib)

| No | Skenario Pengujian | Hasil yang Diharapkan | Status |
|---|---|---|---|
| 1 | Daftar warung ditampilkan | Menampilkan daftar warung dari backend secara rapi | ✅ Terimplementasi |
| 2 | Detail warung ditampilkan | Klik "Lihat Detail" menampilkan info spesifik & menu warung | ✅ Terimplementasi |
| 3 | Pencarian, Filter & Paginasi | Hasil terfilter sesuai input, halaman berpindah dengan benar | ✅ Terimplementasi |
| 4 | Admin CRUD warung | Admin dapat tambah, ubah semua kantin, dan hapus kantin | ✅ Terimplementasi |
| 5 | Owner tambah warung | Owner dapat membuat kantin baru | ✅ Terimplementasi |
| 6 | Owner ubah warung sendiri | Owner dapat mengedit kantin yang ia buat (`ownerId` cocok) | ✅ Terimplementasi |
| 7 | Owner ubah warung lain | Dicegah oleh UI & backend menampilkan 403 Forbidden | ✅ Terimplementasi |
| 8 | Owner hapus warung | Tombol hapus tidak muncul untuk owner; backend menolak jika dipanggil | ✅ Terimplementasi |
| 9 | Registrasi & Login | Akun baru berhasil didaftarkan dan dapat login memperoleh JWT | ✅ Terimplementasi |
| 10 | Verifikasi Sesi (`/auth/me`) | Sesi login tetap bertahan saat halaman direfresh | ✅ Terimplementasi |
| 11 | Penanganan Hak Akses (401/403)| Halaman create/edit memblokir akses yang tidak sah | ✅ Terimplementasi |
| 12 | Loading, Empty & Error State | Spinner loading, pesan kosong saat nihil, & pesan error informatif | ✅ Terimplementasi |

