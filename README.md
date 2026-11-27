 ## LinguaSpace
Platform Pembelajaran Bahasa Online
LinguaSpace merupakan platform pembelajaran bahasa secara daring yang dirancang untuk menyediakan pengalaman belajar interaktif antara guru dan siswa. Pengguna dapat menjelajahi berbagai kursus bahasa, mengikuti kelas, mengakses materi pembelajaran, memantau perkembangan belajar, berpartisipasi dalam diskusi, serta memperoleh sertifikat setelah menyelesaikan kursus.
Platform ini memiliki empat jenis pengguna, yaitu Admin, Teacher, Student, dan Public User (Guest). Setiap pengguna memiliki hak akses dan tanggung jawab yang berbeda sesuai dengan perannya masing-masing.

 ## Fitur Utama
1. Autentikasi (Authentication)
•	Fitur login dan registrasi pengguna.
•	Registrasi sebagai Student atau Teacher.
•	Pengamanan password menggunakan bcryptjs.
•	Pengelolaan sesi login menggunakan iron-session.
•	Pembatasan akses berdasarkan peran pengguna (Role-Based Access Control).
2. Dashboard Admin
Admin memiliki hak akses untuk mengelola berbagai bagian utama platform.
•	Melihat statistik platform.
•	Melihat dan mengelola seluruh pengguna.
•	Menambahkan, mengedit, dan menghapus akun pengguna.
•	Memeriksa pengajuan pendaftaran Teacher.
•	Menyetujui atau menolak pengajuan Teacher.
•	Mengubah peran pengguna secara otomatis setelah pengajuan disetujui.
•	Mengelola kategori kursus.
•	Membuat, melihat, mengedit, dan menghapus kursus.
•	Menentukan Teacher untuk setiap kursus.
3. Dashboard Teacher
Teacher dapat mengelola materi pembelajaran pada kursus yang ditugaskan kepadanya.
•	Melihat daftar kursus yang ditugaskan.
•	Melihat daftar siswa yang mengikuti kursus.
•	Memantau perkembangan belajar siswa.
•	Melihat statistik pengajaran.
•	Menambahkan materi pembelajaran.
•	Mengedit materi pembelajaran.
•	Menghapus materi pembelajaran.
•	Mengatur urutan materi menggunakan order index.
Teacher hanya dapat mengelola materi pembelajaran pada kursus yang menjadi tanggung jawabnya.
4. Dashboard Student
Student dapat mengikuti berbagai kegiatan pembelajaran melalui platform.
•	Melihat dashboard pribadi.
•	Menjelajahi kursus yang tersedia.
•	Mendaftar atau mengikuti kursus (Enrollment).
•	Mengakses kursus yang telah diikuti.
•	Melihat materi pembelajaran.
•	Menandai materi yang telah diselesaikan (Mark as Done).
•	Memantau perkembangan belajar.
•	Melanjutkan pembelajaran.
•	Berpartisipasi dalam diskusi kursus.
•	Melihat riwayat belajar.
•	Mengakses sertifikat.
•	Mengelola informasi profil pribadi.
5. Public User (Guest)
Pengunjung dapat mengakses beberapa fitur platform tanpa harus login.
•	Mengakses halaman utama (Homepage).
•	Melihat daftar kursus yang tersedia.
•	Melihat detail kursus.
•	Mencari kursus.
•	Memfilter kursus berdasarkan kategori.
•	Melihat informasi Teacher.
Guest harus melakukan registrasi dan login sebagai Student sebelum dapat mengikuti kursus.
6. Perkembangan Belajar (Learning Progress)
Fitur ini digunakan untuk memantau perkembangan pembelajaran Student.
•	Mencatat materi yang telah diselesaikan.
•	Menghitung persentase penyelesaian kursus.
•	Menampilkan perkembangan belajar siswa.
•	Menyimpan catatan penyelesaian materi pembelajaran.
7. Forum Diskusi (Discussion Forum)
Setiap materi pembelajaran menyediakan fitur diskusi yang memungkinkan siswa untuk:
•	Menambahkan komentar pada materi pembelajaran.
•	Berpartisipasi dalam diskusi.
•	Berinteraksi dengan siswa lainnya melalui kolom komentar.
8. Sertifikat (Certificate)
LinguaSpace menyediakan fitur sertifikat bagi Student yang telah menyelesaikan seluruh materi pembelajaran dalam suatu kursus yang diikuti.
•	Menampilkan sertifikat untuk kursus yang telah diselesaikan.
•	Menyediakan halaman khusus untuk melihat sertifikat.
•	Memberikan akses kepada siswa terhadap sertifikat penyelesaian kursus.

## Bahasa yang Tersedia
LinguaSpace menyediakan kursus pembelajaran dalam beberapa bahasa, yaitu:
•	🇬🇧 Bahasa Inggris (English)
•	🇯🇵 Bahasa Jepang (Japanese)
•	🇰🇷 Bahasa Korea (Korean)
•	🇫🇷 Bahasa Prancis (French)
•	🇪🇸 Bahasa Spanyol (Spanish)
•	🇨🇳 Bahasa Mandarin (Mandarin)
•	🇵🇹 Bahasa Portugis (Portuguese – European Portuguese)

Teknologi yang Digunakan
1.	Next.js: Framework untuk pengembangan aplikasi web.
2.	JavaScript: Bahasa pemrograman utama yang digunakan dalam pengembangan aplikasi.
3.	JSX: Sintaks yang digunakan untuk menulis struktur tampilan pada komponen.
4.	Tailwind CSS: Framework CSS untuk mengatur desain dan tampilan antarmuka aplikasi.
5.	Node.js: Runtime JavaScript yang digunakan untuk menjalankan aplikasi.
6.	PostgreSQL: Sistem manajemen basis data untuk menyimpan dan mengelola data aplikasi.

Struktur Basis Data (Database Structure)
LinguaSpace menggunakan PostgreSQL sebagai sistem pengelolaan basis data.
Berikut merupakan tabel-tabel utama yang digunakan:
1. users
Menyimpan informasi akun dan peran pengguna.
2. categories
Menyimpan data kategori kursus.
3. courses
Menyimpan informasi kursus.
4. contents
Menyimpan materi pembelajaran.
5. enrollments
Menyimpan data pendaftaran siswa ke kursus.
6. content_progress
Menyimpan catatan penyelesaian materi pembelajaran.
7. certificates
Menyimpan data sertifikat siswa.
8. comments
Menyimpan komentar dan diskusi pada materi pembelajaran.
9. teacher_applications
Menyimpan data pengajuan pendaftaran Teacher dan informasi persetujuannya.

## Instalasi dan Menjalankan Project
Ikuti langkah-langkah berikut untuk menjalankan LinguaSpace pada komputer lokal.
Persyaratan (Prerequisites)
Pastikan perangkat sudah memiliki aplikasi berikut:
•	Node.js
•	npm
•	PostgreSQL
•	Visual Studio Code (disarankan)
1. Instalasi Dependencies
Buka folder project melalui terminal, kemudian jalankan perintah berikut:
npm install
Perintah tersebut digunakan untuk menginstal seluruh dependencies yang dibutuhkan oleh project.
2. Konfigurasi Environment Variables
Buat file bernama .env.local pada folder utama project.
Masukkan konfigurasi berikut:
DB_HOST=localhost
DB_PORT=5432
DB_NAME=linguaspace
DB_USER=postgres
DB_PASSWORD=password_postgresql_kamu

SESSION_SECRET=secret_session_kamu
Sesuaikan konfigurasi tersebut dengan informasi koneksi PostgreSQL pada komputer masing-masing.
Pastikan database PostgreSQL beserta tabel-tabel yang dibutuhkan sudah dibuat.
3. Menjalankan Development Server
Jalankan perintah berikut melalui terminal:
npm run dev
Perintah tersebut digunakan untuk menjalankan aplikasi dalam mode pengembangan.
4. Membuka Aplikasi
Setelah development server berhasil dijalankan, buka browser dan akses alamat berikut:
http://localhost:3000
Aplikasi LinguaSpace sekarang dapat diakses melalui browser.

## Peran dan Hak Akses Pengguna
Setiap pengguna memiliki hak akses yang berbeda sesuai dengan perannya.
1. Admin:
Mengelola pengguna, kursus, kategori, dan pengajuan Teacher. Admin juga dapat melihat statistik platform serta menyetujui atau menolak pengajuan Teacher.
2. Teacher:
Mengelola materi pembelajaran pada kursus yang ditugaskan, melihat daftar siswa, dan memantau perkembangan belajar siswa.
3. Student:
Mengikuti kursus, mengakses materi pembelajaran, menandai materi yang telah selesai, memantau perkembangan belajar, mengikuti diskusi, melihat riwayat belajar, dan mengakses sertifikat.
4. Guest:
Melihat halaman utama, menjelajahi daftar kursus, melihat detail kursus, mencari kursus, memfilter kategori, dan melihat informasi Teacher tanpa harus login.
Alur Registrasi dan Persetujuan Teacher
LinguaSpace menerapkan proses verifikasi untuk pengguna yang mendaftar sebagai Teacher.
1.	Pengguna dapat melakukan registrasi melalui pilihan Student atau Teacher.
2.	Seluruh akun yang baru didaftarkan akan mendapatkan peran Student terlebih dahulu.
3.	Pengguna yang mendaftar melalui pilihan Teacher akan memiliki status pengajuan Pending.
4.	Admin memeriksa pengajuan pendaftaran Teacher.
5.	Admin dapat menyetujui (Approve) atau menolak (Reject) pengajuan tersebut.
6.	Jika disetujui, peran pengguna akan berubah menjadi Teacher secara otomatis.
7.	Sistem mencatat waktu persetujuan melalui timestamp.
8.	Teacher yang telah disetujui akan mendapatkan notifikasi selamat datang.

## Struktur Folder Project
Project LinguaSpace menggunakan arsitektur Next.js App Router.
Berikut merupakan struktur folder project LinguaSpace:
linguaspace/
│
├── public/
│   ├── images/
│   │   ├── courses/
│   │   │   ├── english.jpeg
│   │   │   ├── french.jpeg
│   │   │   ├── japanese.jpeg
│   │   │   ├── korean.jpeg
│   │   │   ├── mandarin.jpeg
│   │   │   ├── portuguese.jpeg
│   │   │   └── spanish.jpeg
│   │   │
│   │   └── flags/
│   │       ├── cn.svg
│   │       ├── es.svg
│   │       ├── fr.svg
│   │       ├── gb.svg
│   │       ├── jp.svg
│   │       ├── kr.svg
│   │       └── pt.svg
│   │
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── categories/
│   │   │   ├── contents/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   ├── teachers/
│   │   │   └── users/
│   │   │
│   │   ├── api/
│   │   │   ├── admin/
│   │   │   ├── categories/
│   │   │   ├── courses/
│   │   │   ├── db-test/
│   │   │   ├── login/
│   │   │   ├── logout/
│   │   │   ├── me/
│   │   │   ├── register/
│   │   │   ├── student/
│   │   │   ├── teacher/
│   │   │   ├── teacher-application/
│   │   │   └── teachers/
│   │   │
│   │   ├── courses/
│   │   ├── dashboard/
│   │   ├── login/
│   │   ├── register/
│   │   │
│   │   ├── student/
│   │   │   ├── certificate/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   ├── explore/
│   │   │   ├── history/
│   │   │   ├── learn/
│   │   │   └── profile/
│   │   │
│   │   ├── teacher/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   └── students/
│   │   │
│   │   ├── teacher-application/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   │
│   ├── components/
│   │   ├── CertificatesClient.js
│   │   ├── LogoutButton.js
│   │   ├── RoleDashboard.js
│   │   ├── StudentDashboard.js
│   │   ├── TeacherContents.js
│   │   └── TeacherDashboard.js
│   │
│   ├── lib/
│   │   ├── db.js
│   │   └── session.js
│   │
│   └── linguaspace_database.sql
│
├── .env.local
├── .gitignore
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── package-lock.json
└── README.md


## Keamanan Aplikasi
LinguaSpace menerapkan beberapa mekanisme keamanan dasar, antara lain:
•	Pengamanan password menggunakan bcryptjs.
•	Pengelolaan sesi pengguna menggunakan iron-session.
•	Pembatasan akses berdasarkan peran pengguna.
•	Pemeriksaan autentikasi pada sisi server.
•	Perlindungan pada API sesuai hak akses pengguna.
•	Pembatasan akses terhadap fitur administrasi.

