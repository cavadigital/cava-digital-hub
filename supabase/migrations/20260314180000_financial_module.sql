CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  document VARCHAR(18) UNIQUE NOT NULL,
  email VARCHAR(255),
  address_json JSONB,
  omie_id VARCHAR(100)
);

CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  service_description TEXT,
  monthly_value DECIMAL(10,2),
  billing_day INTEGER,
  status VARCHAR(20) DEFAULT 'active'
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  amount DECIMAL(10,2),
  due_date DATE,
  status VARCHAR(20),
  gateway_id VARCHAR(100),
  bank_slip_url TEXT,
  pix_code TEXT
);

CREATE TABLE fiscal_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE CASCADE,
  status VARCHAR(20),
  nfe_number VARCHAR(50),
  xml_url TEXT,
  pdf_url TEXT,
  error_message TEXT
);

