"""TCG DataApp: the model of Lesson 6, automated as a Python package.

Three layers, each one depending only on the layer below it:

    views       questions and reports read from the gold layer
    processors  the gold layer (dimensions, fact, cube, mart, reports) and its checks
    etls        extraction from TCGplayer (tcgcsv.com) and load into db_ingestion

The pipeline module wires the layers into one run with dependencies and retries
(the hand-written runner of Lesson 7); the flows module does the same with Prefect
(Lesson 8), with a schedule, a server and a UI.
"""

__version__ = "0.2.0"
