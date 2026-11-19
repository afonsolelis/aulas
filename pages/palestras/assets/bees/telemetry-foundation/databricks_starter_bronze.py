# Databricks notebook source
# MAGIC %md
# MAGIC # Tradeline telemetry harmonisation lab · bronze ingestion
# MAGIC Tradeline is a fictional company and every file is synthetic.
# MAGIC Upload the CSV files of the lab to a Unity Catalog volume and set the three widgets.
# MAGIC The notebook only lands the files as text in bronze tables, with the source file and the
# MAGIC load time. Typing, harmonisation, the silver and gold layers and the reconciliation are the lab.

# COMMAND ----------

dbutils.widgets.text("catalog", "main")
dbutils.widgets.text("schema", "tradeline_lab")
dbutils.widgets.text("volume_path", "/Volumes/main/tradeline_lab/raw")

catalog = dbutils.widgets.get("catalog")
schema = dbutils.widgets.get("schema")
volume_path = dbutils.widgets.get("volume_path").rstrip("/")

spark.sql(f"CREATE SCHEMA IF NOT EXISTS {catalog}.{schema}")

# COMMAND ----------

from pyspark.sql import functions as F

# Brazil uses ";" as separator and "," as decimal mark; every other file uses ",".
FILES = {
    "bronze_checkout_events_br": ("checkout_events_br.csv", ";"),
    "bronze_checkout_events_mx": ("checkout_events_mx.csv", ","),
    "bronze_checkout_events_co": ("checkout_events_co.csv", ","),
    "bronze_checkout_events_za": ("checkout_events_za.csv", ","),
    "bronze_checkout_events_do": ("checkout_events_do.csv", ","),
    "bronze_fx_rates": ("fx_rates.csv", ","),
    "bronze_dim_retailer": ("dim_retailer.csv", ","),
    "bronze_local_reported_kpis": ("local_reported_kpis.csv", ","),
    "bronze_orchestration_graph": ("orchestration_graph.csv", ","),
}

for table, (file_name, sep) in FILES.items():
    df = (spark.read
          .option("header", True)
          .option("sep", sep)
          .option("inferSchema", False)      # bronze keeps text; types are decided in silver
          .csv(f"{volume_path}/{file_name}"))
    # Column names such as "properties.order_id" and "$insert_id" are not valid Delta names.
    for c in df.columns:
        clean = c.replace(".", "_").replace("$", "")
        if clean != c:
            df = df.withColumnRenamed(c, clean)
    (df.withColumn("_source_file", F.lit(file_name))
       .withColumn("_loaded_at", F.current_timestamp())
       .write.mode("overwrite").option("overwriteSchema", True)
       .saveAsTable(f"{catalog}.{schema}.{table}"))
    print(f"{table}: {spark.table(f'{catalog}.{schema}.{table}').count()} rows")

# COMMAND ----------

# MAGIC %md
# MAGIC ## First look
# MAGIC Count the distinct event names per market before deciding the canonical event list.

# COMMAND ----------

display(spark.sql(f"""
  SELECT 'BR' AS market, nome_evento AS local_event, count(*) AS n FROM {catalog}.{schema}.bronze_checkout_events_br GROUP BY ALL
  UNION ALL SELECT 'MX', event_type, count(*) FROM {catalog}.{schema}.bronze_checkout_events_mx GROUP BY ALL
  UNION ALL SELECT 'CO', event, count(*) FROM {catalog}.{schema}.bronze_checkout_events_co GROUP BY ALL
  UNION ALL SELECT 'ZA', evt, count(*) FROM {catalog}.{schema}.bronze_checkout_events_za GROUP BY ALL
  UNION ALL SELECT 'DO', estado, count(*) FROM {catalog}.{schema}.bronze_checkout_events_do GROUP BY ALL
  ORDER BY market, n DESC
"""))
