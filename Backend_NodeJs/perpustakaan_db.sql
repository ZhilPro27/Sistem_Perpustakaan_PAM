CREATE DATABASE perpustakaan_db;

CREATE TABLE pustakawan (
	id_pustakawan INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE anggota (
	id_anggota INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(50) NOT NULL,
    no_hp VARCHAR(15) UNIQUE NOT NULL,
    alamat VARCHAR(255) NOT NULL,
    CONSTRAINT check_no_hp CHECK (no_hp REGEXP '^[0-9]+$')
);

CREATE TABLE buku (
	id_buku INT PRIMARY KEY AUTO_INCREMENT,
    judul VARCHAR(255) NOT NULL,
    penulis VARCHAR(50) NOT NULL,
    penerbit VARCHAR(50) NOT NULL,
    tahun_terbit YEAR NOT NULL,
    isbn VARCHAR(13) NOT NULL,
    nomor_panggil VARCHAR(10) NULL,
    stok INT NOT NULL,
    gambar VARCHAR(255) NULL,
    deskripsi TEXT NULL,
    CONSTRAINT check_stok_buku CHECK(stok >= 0)
);

CREATE TABLE peminjaman (
	id_peminjaman INT PRIMARY KEY AUTO_INCREMENT,
    tanggal_pinjam DATE NOT NULL,
    tanggal_jatuh_tempo DATE NOT NULL,
    tanggal_kembali DATE NULL,
    status VARCHAR(8) NOT NULL,
    id_anggota INT NOT NULL,
    id_buku INT NOT NULL,
    FOREIGN KEY (id_anggota) 
		REFERENCES anggota(id_anggota)
		ON UPDATE CASCADE
        ON DELETE CASCADE,
	FOREIGN KEY (id_buku)
		REFERENCES buku(id_buku)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	CONSTRAINT check_status_peminjaman CHECK(status IN ('dipinjam', 'kembali')),
    CONSTRAINT check_tanggal_jatuh_tempo CHECK(tanggal_jatuh_tempo > tanggal_pinjam)
);

CREATE TABLE denda(
	id_denda INT PRIMARY KEY AUTO_INCREMENT,
    jumlah INT NOT NULL,
    hari_terlambat INT NOT NULL,
    status VARCHAR(11) NOT NULL,
    tanggal_dibayar DATE NULL,
    id_peminjaman INT NOT NULL,
    FOREIGN KEY (id_peminjaman)
		REFERENCES peminjaman(id_peminjaman)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
	CONSTRAINT check_status_denda CHECK(status IN ('belum bayar', 'lunas')),
    CONSTRAINt check_jumlah_denda CHECK(jumlah >= 0)
);

DELIMITER $$
CREATE TRIGGER kurangi_stok_buku
AFTER INSERT ON peminjaman
FOR EACH ROW 
BEGIN
	UPDATE buku
    SET stok = stok - 1
    WHERE id_buku = NEW.id_buku;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER tambah_stok_buku
AFTER DELETE ON peminjaman
FOR EACH ROW
BEGIN
	IF OLD.status = 'dipinjman' THEN
		UPDATE buku
		SET stok = stok +1
		WHERE id_buku = OLD.id_buku;
	END IF;
END$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER pengembalian_buku 
BEFORE UPDATE ON peminjaman
FOR EACH ROW 
BEGIN
	DECLARE jumlahDenda INT;
    DECLARE hariTerlambat INT;
	IF NEW.status = 'kembali' AND OLD.status = 'dipinjam' THEN
		SET NEW.tanggal_kembali = CURDATE();
        
        UPDATE buku
        SET stok = stok + 1
        WHERE id_buku = NEW.id_buku;
        
        IF (NEW.tanggal_kembali > OLD.tanggal_jatuh_tempo) THEN
			SET hariTerlambat = DATEDIFF(NEW.tanggal_kembali, OLD.tanggal_jatuh_tempo);
            SET jumlahDenda = hariTerlambat * 1000;
            INSERT INTO denda (jumlah, hari_terlambat, status, id_peminjaman) 
            VALUES (jumlahDenda, hariTerlambat, 'belum bayar', OLD.id_peminjaman);
		END IF;
	END IF;
END$$
DELIMITER ;

SHOW TRIGGERS;

-- 1. Data Pustakawan
INSERT INTO pustakawan (email, password) VALUES 
('admin@perpus.com', 'admin123'),
('staff@perpus.com', 'staff2024');

-- 2. Data Anggota
-- Perhatikan: no_hp harus angka (sesuai CHECK constraint)
INSERT INTO anggota (nama, no_hp, alamat) VALUES 
('Budi Santoso', '081234567890', 'Jl. Merdeka No. 10, Jakarta'),
('Siti Aminah', '08987654321', 'Jl. Sudirman No. 45, Bandung'),
('Rudi Hermawan', '085678901234', 'Jl. Diponegoro No. 12, Surabaya');

-- 3. Data Buku
-- Stok awal kita set bervariasi
INSERT INTO buku (judul, penulis, penerbit, tahun_terbit, isbn, nomor_panggil, stok, deskripsi) VALUES 
('Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, '9789793062792', '813 AND l', 5, 'Novel tentang perjuangan sekolah di Belitung'),
('Bumi Manusia', 'Pramoedya Ananta Toer', 'Hasta Mitra', 1980, '9789796054173', '813 PRA b', 3, 'Sejarah pergerakan nasional awal abad 20'),
('Filosofi Kopi', 'Dee Lestari', 'Truedee', 2006, '9789799625749', '813 DEE f', 10, 'Kumpulan cerita pendek dan prosa');


-- UJI TRIGGER
-- Trigger kurangi_stok_buku
-- Budi (ID 1) meminjam Laskar Pelangi (ID 1)
INSERT INTO peminjaman (tanggal_pinjam, tanggal_jatuh_tempo, status, id_anggota, id_buku) 
VALUES (CURDATE(), ADDDATE(CURDATE(), INTERVAL 7 DAY), 'dipinjam', 1, 1);

-- Cek stok (Harusnya sekarang jadi 4)
SELECT * FROM buku WHERE id_buku = 1;

-- Trigger pengembalian
UPDATE peminjaman 
SET status = 'kembali' 
WHERE id_peminjaman = 1;

-- Cek stok (Harusnya kembali jadi 5)
SELECT * FROM buku WHERE id_buku = 1;
-- Cek denda (Harusnya kosong)
SELECT * FROM denda;

-- TRIGGER pengembalian + denda
-- 1. Insert data peminjaman "Masa Lalu" (Anggap pinjam sebulan lalu)
INSERT INTO peminjaman (tanggal_pinjam, tanggal_jatuh_tempo, status, id_anggota, id_buku) 
VALUES ('2023-10-01', '2023-10-08', 'dipinjam', 2, 2); 
-- Siti meminjam Bumi Manusia (Stok berkurang jadi 2)

-- 2. Proses Pengembalian HARI INI
-- Karena jatuh tempo 2023-10-08 dan dikembalikan sekarang, pasti kena denda
UPDATE peminjaman 
SET status = 'kembali' 
WHERE id_anggota = 2 AND id_buku = 2 AND status = 'dipinjam';

-- 3. Cek Hasil
-- Stok Bumi Manusia harusnya nambah lagi jadi 3
SELECT * FROM buku WHERE id_buku = 2;

-- Cek Tabel Denda (Harusnya ada data baru dengan jumlah denda besar)
SELECT * FROM denda;

UPDATE denda
SET status = 'lunas'
WHERE id_denda = 1