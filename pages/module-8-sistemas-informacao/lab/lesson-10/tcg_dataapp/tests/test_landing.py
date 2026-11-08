import duckdb

from tcg_dataapp.etls.landing import counts, load_batch


def test_a_batch_loaded_twice_is_replaced_not_duplicated():
    con = duckdb.connect()
    load_batch(con, "tcgplayer.set.v1", 100, [{"groupId": 1}, {"groupId": 2}])
    load_batch(con, "tcgplayer.set.v1", 100, [{"groupId": 1}])
    load_batch(con, "tcgplayer.set.v1", 200, [{"groupId": 1}])
    assert counts(con) == [("tcgplayer.set.v1", 2, 100, 200)]


def test_timestamps_are_unix_integers():
    con = duckdb.connect()
    load_batch(con, "tcgplayer.price.v1", 1794052800, [{"productId": 1}])
    assert con.execute("SELECT typeof(timestamp) FROM db_ingestion").fetchall() == [("BIGINT",)]
