-- Step 01 · Classify the personal data and decide what the DataApp keeps
-- Lesson 13 · Module 8 · Information Systems · Inteli
--
-- LGPD (Law 13,709/2018), art. 5: personal data (I) identifies a natural person
-- or makes the person identifiable; sensitive personal data (II) includes data on
-- health, among others; anonymised data (III) can no longer be linked to a person.
-- Art. 6, III (necessity): only the data needed for the declared purpose.
-- The catalogue below is the first control of the lesson: a column without a
-- category, a purpose and a retention rule has no reason to exist.

CREATE SCHEMA gov;

CREATE TABLE gov.data_catalog (
  table_name     text NOT NULL,
  column_name    text NOT NULL,
  category       text NOT NULL CHECK (category IN ('personal', 'sensitive', 'anonymous', 'operational')),
  identifier     text NOT NULL CHECK (identifier IN ('direct', 'quasi', 'none')),
  purpose        text NOT NULL,
  legal_basis    text NOT NULL,
  retention_days integer,
  analytics      text NOT NULL CHECK (analytics IN ('keep', 'pseudonymise', 'generalise', 'drop')),
  PRIMARY KEY (table_name, column_name)
);

INSERT INTO gov.data_catalog VALUES
  ('stores',    'store_id',           'operational', 'none',   'identify the store',                 'not personal data',                 NULL, 'keep'),
  ('stores',    'city',               'operational', 'none',   'location of the store',              'not personal data',                 NULL, 'keep'),
  ('stores',    'uf',                 'operational', 'none',   'location of the store',              'not personal data',                 NULL, 'keep'),
  ('customers', 'customer_id',        'personal',    'direct', 'link orders to the customer',        'art. 7, V: performance of contract', 1825, 'pseudonymise'),
  ('customers', 'store_id',           'personal',    'quasi',  'store where the customer is served', 'art. 7, V: performance of contract', 1825, 'keep'),
  ('customers', 'full_name',          'personal',    'direct', 'identify the customer at the counter', 'art. 7, V: performance of contract', 1825, 'drop'),
  ('customers', 'email',              'personal',    'direct', 'send the receipt',                   'art. 7, V: performance of contract', 1825, 'drop'),
  ('customers', 'cpf',                'personal',    'direct', 'issue the invoice',                  'art. 7, II: legal obligation',       1825, 'drop'),
  ('customers', 'phone',              'personal',    'direct', 'notify a reserved order',            'art. 7, V: performance of contract', 1825, 'drop'),
  ('customers', 'birth_unix',         'personal',    'quasi',  'confirm the customer is of age',     'art. 7, V: performance of contract', 1825, 'generalise'),
  ('customers', 'city',               'personal',    'quasi',  'delivery',                           'art. 7, V: performance of contract', 1825, 'drop'),
  ('customers', 'accessibility_need', 'sensitive',   'none',   'adapt the service at the store',     'art. 11, I: specific consent',        365, 'drop'),
  ('customers', 'marketing_consent',  'personal',    'none',   'record of the consent',              'art. 7, I: consent',                 1825, 'keep'),
  ('customers', 'consent_unix',       'personal',    'none',   'proof of the consent (art. 8, §2)',  'art. 7, I: consent',                 1825, 'drop'),
  ('customers', 'created_unix',       'personal',    'none',   'customer since',                     'art. 7, V: performance of contract', 1825, 'generalise'),
  ('orders',    'order_id',           'operational', 'none',   'identify the order',                 'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'customer_id',        'personal',    'direct', 'link the order to the customer',     'art. 7, V: performance of contract', 1825, 'pseudonymise'),
  ('orders',    'store_id',           'operational', 'none',   'store of the sale',                  'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'ordered_unix',       'personal',    'quasi',  'date of the sale',                   'art. 7, V: performance of contract', 1825, 'generalise'),
  ('orders',    'product',            'operational', 'none',   'what was sold',                      'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'set_name',           'operational', 'none',   'set of the card',                    'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'quantity',           'operational', 'none',   'how many units',                     'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'unit_price',         'operational', 'none',   'price paid',                         'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'payment_method',     'operational', 'none',   'reconcile the cash register',        'art. 7, V: performance of contract', 1825, 'keep'),
  ('orders',    'card_last4',         'personal',    'quasi',  'answer a dispute of the payment',    'art. 7, IX: legitimate interest',     180, 'drop');

COMMENT ON COLUMN shop.customers.accessibility_need IS 'Sensitive personal data (LGPD art. 5, II, health). Store staff only; never in analytics.';
COMMENT ON COLUMN shop.customers.cpf IS 'Direct identifier. Invoice only; never in analytics.';

-- Test 1: every column of the schema shop is classified (expected: no rows).
SELECT c.table_name, c.column_name
FROM information_schema.columns AS c
LEFT JOIN gov.data_catalog AS d USING (table_name, column_name)
WHERE c.table_schema = 'shop' AND d.column_name IS NULL;

-- Test 2: the catalogue has no column that is not in the database (expected: no rows).
SELECT d.table_name, d.column_name
FROM gov.data_catalog AS d
LEFT JOIN information_schema.columns AS c
  ON c.table_schema = 'shop' AND c.table_name = d.table_name AND c.column_name = d.column_name
WHERE c.column_name IS NULL;

-- What reaches the analytics layer, by category.
SELECT category, analytics, count(*) AS columns, string_agg(table_name || '.' || column_name, ', ' ORDER BY table_name, column_name) AS which
FROM gov.data_catalog
GROUP BY category, analytics
ORDER BY category, analytics;
