/*
  # Setup Database untuk Jastip by Livia

  1. New Tables
    - `pesanan` - Menyimpan data pesanan dari customer
      - `id` (uuid, primary key)
      - `nama` (text, nama lengkap customer)
      - `alamat` (text, alamat lengkap)
      - `no_hp` (text, nomor HP/WhatsApp)
      - `email` (text, email customer)
      - `barang` (text, detail barang yang dititipkan)
      - `metode_bayar` (text, COD atau Transfer)
      - `catatan` (text, catatan tambahan, nullable)
      - `status` (text, status pesanan: pending/processed/completed)
      - `created_at` (timestamp)

    - `invoice` - Menyimpan data invoice untuk setiap pesanan
      - `id` (uuid, primary key)
      - `id_pesanan` (uuid, foreign key ke pesanan)
      - `harga` (numeric, harga barang)
      - `fee` (numeric, fee jastip)
      - `diskon` (numeric, diskon yang diberikan)
      - `dp` (numeric, down payment)
      - `total` (numeric, total pembayaran)
      - `status` (text, status pembayaran: belum_lunas/lunas)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users (admin)
    - Public access untuk invoice page (read-only)

  3. Indexes
    - Add indexes for better query performance
*/

-- Create pesanan table
CREATE TABLE IF NOT EXISTS pesanan (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nama text NOT NULL,
  alamat text NOT NULL,
  no_hp text NOT NULL,
  email text NOT NULL,
  barang text NOT NULL,
  metode_bayar text NOT NULL DEFAULT 'Transfer',
  catatan text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Create invoice table
CREATE TABLE IF NOT EXISTS invoice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  id_pesanan uuid NOT NULL REFERENCES pesanan(id) ON DELETE CASCADE,
  harga numeric(12,2) NOT NULL DEFAULT 0,
  fee numeric(12,2) NOT NULL DEFAULT 0,
  diskon numeric(12,2) NOT NULL DEFAULT 0,
  dp numeric(12,2) NOT NULL DEFAULT 0,
  total numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'belum_lunas',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE pesanan ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice ENABLE ROW LEVEL SECURITY;

-- Policies for pesanan table
-- Allow public to insert (untuk form customer)
CREATE POLICY "Allow public to insert pesanan"
  ON pesanan
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated users (admin) to read all
CREATE POLICY "Allow authenticated to read pesanan"
  ON pesanan
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admin) to update
CREATE POLICY "Allow authenticated to update pesanan"
  ON pesanan
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for invoice table
-- Allow authenticated users (admin) to do everything
CREATE POLICY "Allow authenticated to manage invoice"
  ON invoice
  FOR ALL
  TO authenticated
  USING (true);

-- Allow public to read invoice (untuk halaman invoice)
CREATE POLICY "Allow public to read invoice"
  ON invoice
  FOR SELECT
  TO anon
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pesanan_created_at ON pesanan(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pesanan_status ON pesanan(status);
CREATE INDEX IF NOT EXISTS idx_invoice_id_pesanan ON invoice(id_pesanan);
CREATE INDEX IF NOT EXISTS idx_invoice_status ON invoice(status);
CREATE INDEX IF NOT EXISTS idx_invoice_created_at ON invoice(created_at DESC);