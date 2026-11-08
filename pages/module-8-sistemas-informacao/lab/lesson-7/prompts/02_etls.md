[C] Character
You are the same engineer. The package exists; now its first layer, which
brings the data in.

[R] Request
In src/tcg_dataapp/etls/:
1. tcgcsv.py: class TcgcsvClient(base_url, category) with groups(),
   products(group_id), prices_today(group_id) and
   prices_archive(day, group_ids), which downloads
   /archive/tcgplayer/prices-<day>.ppmd.7z, extracts only the files
   <day>/3/<groupId>/prices of the sets asked and returns
   {group_id: [price records]}. Standard library plus py7zr.
2. landing.py: the table db_ingestion (timestamp BIGINT, data_json JSON,
   data_tag VARCHAR); a function run(con, sql, params) that executes and
   consumes the result; load_batch(con, data_tag, timestamp, records) that
   replaces the batch (data_tag, timestamp) inside one transaction; counts.
3. extract.py: unix(day, hour=12) in UTC; extract_sets, extract_products
   (drop imageUrl and keep only Number, Rarity, Card Type, HP and Stage in
   extendedData), extract_prices_archive (batch at noon UTC of the day)
   and extract_prices_today (batch at noon UTC of today).
4. tests/test_landing.py: a batch loaded twice is replaced, not
   duplicated; the timestamp is BIGINT.

Facts measured on 07/11/2026 (confirm before use):
- sets 7, products 1,490, prices 657, 896, 1,153, 1,414 and 1,831 on the
  five dates; the five archives take about 3 s each.
- The archive of a day holds every category; only 2 to 7 of the sets
  exist in it, depending on the date.

[E] Example
load_batch(con, "tcgplayer.price.v1", unix("2026-09-01"), records)

[A] Adjustments
- DuckDB 2.0 keeps the result of execute() open until it is read; the
  next statement on the same connection fails. Consume every result.
- tcgcsv.com has no key and no CORS; send a User-Agent and pause 0.2 s
  between calls.
- A record is loaded exactly as it arrived, except the fields removed to
  save space; no cleaning in this layer.

[T] Type of output
The files and the output of pytest.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
