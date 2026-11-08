[C] Character
You are a dimensional modeller. A table called db_ingestion holds what was
captured from TCGplayer about the Pokemon TCG sets released in 2026, exactly
as it arrived. You write the dimensions of a star schema over it, in DuckDB,
for a lab that runs inside the browser.

[R] Request
1. specs/dimensional_model.md: the business process (the market price of a
   product on a capture date), the grain of the fact (one product, in one
   variant, on one capture date), the four dimensions with their
   hierarchies and a Mermaid ER diagram of the star.
2. sql/01_dimensions.sql, schema gold, every dimension a view over
   db_ingestion:
   - dim_set from tcgplayer.set.v1: set_id, set_name, set_code,
     released_at (Unix time of publishedOn), release_month ('YYYY-MM');
   - dim_product from tcgplayer.product.v1: product_id, set_id,
     product_name, kind ('card' when the product has a collector Number,
     otherwise 'sealed'), number, rarity, card_type, hp, stage;
   - dim_variant: the distinct subTypeName of tcgplayer.price.v1;
   - dim_date: date_unix (Unix time of 00:00 UTC of the day of the
     capture), month ('YYYY-MM'), quarter, year of the capture dates of the
     prices;
   - a final SELECT with the number of rows of each dimension.

Facts measured on 07/11/2026 (confirm before use):
- db_ingestion: 7 sets, 1,490 products, 5,951 prices.
- 1,273 products are cards; 3 variants; 5 capture dates, date_unix
  1772323200 (2026-03-01), 1777593600 (2026-05-01), 1782864000
  (2026-07-01), 1788220800 (2026-09-01) and 1794009600 (2026-11-07).

[E] Example
db_ingestion(timestamp BIGINT, data_json JSON, data_tag VARCHAR)
timestamp is Unix time in seconds, UTC: 1794052800 = 2026-11-07 12:00.
tcgplayer.set.v1     {"groupId":24541,"name":"ME: Ascended Heroes",
                      "abbreviation":"ASC","publishedOn":"2026-01-30T00:00:00",...}
tcgplayer.product.v1 {"productId":676088,"name":"Pikachu ex - 276/217",
                      "groupId":24541,"extendedData":[
                      {"name":"Number","value":"276/217"},
                      {"name":"Rarity","value":"Special Illustration Rare"},...]}
tcgplayer.price.v1   {"productId":676088,"marketPrice":571.17,
                      "lowPrice":504.9,"subTypeName":"Holofoil",...}

[A] Adjustments
- Every date of the model is Unix time in seconds (BIGINT), never DATE or
  TIMESTAMP. The day of a timestamp is timestamp // 86400 * 86400; to
  extract a label such as the month, use epoch_ms(timestamp * 1000),
  which returns a TIMESTAMP in UTC, never to_timestamp, which depends on
  the time zone of the browser.
- Read a field with data_json->>'field'.
- The attributes of a product are a list of {name, value} in extendedData.
  Inside a macro or a lambda, use json_extract(j, '$.extendedData') and
  the syntax lambda e: ..., because -> is ambiguous there.
- The rarity of a sealed product is 'n/a'.
- The script is pasted into the lab page and runs in DuckDB-WASM 1.32
  (DuckDB 1.4): no files, no COPY, no read_json.

[T] Type of output
The two files and nothing else.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
