-- tcg_dataapp · processors · 04 · Live reports: normal views over the last capture
--
-- The frozen reports are not here: they are tables created once per month by
-- processors/gold.py (freeze_month) and never rebuilt.

CREATE SCHEMA IF NOT EXISTS report;

CREATE OR REPLACE VIEW report.v_card_price_latest AS
SELECT captured_at, set_name, card, rarity, variant, market_price
FROM mart_collectors.card_price
WHERE captured_at = (SELECT max(captured_at) FROM mart_collectors.card_price);

CREATE OR REPLACE VIEW report.v_set_value_latest AS
SELECT captured_at, set_name, prices, market_value
FROM mart_collectors.set_value
WHERE captured_at = (SELECT max(captured_at) FROM mart_collectors.set_value);
