[C] Character
You are an analyst of the collectors area. The cube and the mart are
ready, and five questions came from the business.

[R] Request
sql/05_questions.sql, one query per question, each reading the cube or the
mart and never db_ingestion, with a comment naming the OLAP operation:
Q1 roll-up: on 2026-11-07, the average and the maximum market price of a
   card of each rarity;
Q2 slice: the five most expensive cards of Ascended Heroes (ASC) on
   2026-11-07;
Q3 pivot: the market value of each set (rows) on each capture date
   (columns);
Q4 dice and pivot: for Common, Uncommon, Rare and Double Rare on
   2026-11-07, the average price of each variant (Normal, Reverse
   Holofoil, Holofoil) as columns;
Q5 the question of the session: which cards appreciated most between
   their first capture and 2026-11-07, in percent and in US$, among cards
   that cost at least US$ 5 at the first capture.

Facts measured on 07/11/2026 (confirm before use):
- Q1: RGB Rare averages US$ 3,973.48; Special Illustration Rare 76.32;
  Common 0.20.
- Q2: Mega Gengar ex - 284/217 at US$ 614.27 leads.
- Q3: ME: Ascended Heroes went from US$ 5,910.16 on 2026-03-01 to
  3,516.89; ME: 30th Celebration jumps from 1,349.93 to 12,403.41 only
  because most of its cards had no market price on 2026-09-01.
- Q4: a Common costs 0.15 Normal and 0.25 Reverse Holofoil.
- Q5: only Pikachu ex - 276/217 (Holofoil) appreciated, from 480.58 to
  571.17, +18.9 % and +US$ 90.59; every other card lost value.

[E] Example
PIVOT (SELECT set_name, strftime(date, '%m-%d') AS day, market_value
       FROM mart_collectors.set_value)
ON day USING sum(market_value) GROUP BY set_name;

[A] Adjustments
- Q5 compares the same card and variant on two dates, with arg_min and
  arg_max of market_price by date, never the sum of a set.
- Ignore products without market price.

[T] Type of output
The file, the five results and one sentence per question with the answer.

[E] Extras
Show the plan before editing. Record this prompt in docs/prompts.md.
Stop at the end.
