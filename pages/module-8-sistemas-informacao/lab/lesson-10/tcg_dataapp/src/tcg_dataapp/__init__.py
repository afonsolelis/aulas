"""TCG DataApp: the model of Lesson 6, automated as a Python package.

Three layers, each one depending only on the layer below it:

    views       questions and reports read from the gold layer
    processors  the gold layer (dimensions, fact, cube, mart, reports) and its checks
    etls        extraction from TCGplayer (tcgcsv.com) and load into db_ingestion

The pipeline module wires the layers into one run with dependencies and retries,
and Lesson 10 makes the DataApp observable and self-correcting: telemetry.py
(metrics for Prometheus), observability.py (traces and JSON logs with
OpenTelemetry) and control.py (the closed loop that acts on the SLIs).
"""

__version__ = "0.4.1"
