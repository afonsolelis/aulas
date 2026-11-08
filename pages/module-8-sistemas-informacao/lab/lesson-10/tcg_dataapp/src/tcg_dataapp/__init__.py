"""TCG DataApp: the model of Lesson 6, automated as a Python package.

Three layers, each one depending only on the layer below it:

    views       questions and reports read from the gold layer
    processors  the gold layer (dimensions, fact, cube, mart, reports) and its checks
    etls        extraction from TCGplayer (tcgcsv.com) and load into db_ingestion

The pipeline module wires the layers into one run with dependencies and retries,
and the telemetry module (Lesson 10) turns every run into Prometheus metrics.
"""

__version__ = "0.4.0"
