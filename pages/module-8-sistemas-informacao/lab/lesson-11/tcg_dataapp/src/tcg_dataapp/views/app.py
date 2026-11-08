"""The Streamlit app of the DataApp: a technical infographic and the analytical views.

Run it with `tcg-dataapp app` from the folder of the project. It reads the
warehouse through a read-only connection and only from gold, the marts, the
reports and the run log (all queries are in views/dashboard.py). Dates are
Unix time in the warehouse and are converted to calendar days, in UTC, only
when they are drawn.
"""
from __future__ import annotations

from datetime import datetime, timezone

import altair as alt
import pandas as pd
import streamlit as st

from tcg_dataapp import __version__
from tcg_dataapp.config import Settings
from tcg_dataapp.views import dashboard as db

# Colours of the Inteli design system: one accent, the rest in ink and greys.
ACCENT = "#2f8f78"   # verde escuro: the marks that carry the message
INK = "#2e2640"      # roxo: text and the main line
TEXT = "#4d475d"
CONTEXT = "#caced6"  # grey: everything that is context
GRID = "#e6eaeb"
DIM_LABELS = {"set_name": "Set", "rarity": "Rarity", "card": "Card", "variant": "Variant"}


def utc_day(unix: int | None) -> str:
    """Calendar day of a Unix time, always in UTC, so 00:00 UTC is never shown as the day before."""
    return "-" if unix is None else datetime.fromtimestamp(int(unix), tz=timezone.utc).strftime("%d/%m/%Y")


def seconds(value) -> str:
    """Durations come from Unix times in whole seconds, so a fast task reads as under one second."""
    return "< 1 s" if not value else f"{value} s"


def money(value) -> str:
    return f"US$ {float(value):,.2f}"


def frame(rows: list[dict]) -> pd.DataFrame:
    df = pd.DataFrame(rows)
    for col in df.columns:
        if df[col].map(lambda v: hasattr(v, "as_integer_ratio") and not isinstance(v, (int, float))).any():
            df[col] = df[col].astype(float)
    return df


def axis_theme(chart: alt.Chart) -> alt.Chart:
    """Recessive grid and axes; Inter for the text; no border around the plot."""
    return (chart.configure_axis(gridColor=GRID, domainColor=CONTEXT, tickColor=CONTEXT, labelColor=TEXT,
                                 titleColor=TEXT, labelFont="Inter", titleFont="Inter", labelFontSize=12,
                                 titleFontWeight=500)
            .configure_view(strokeWidth=0)
            .configure_legend(labelFont="Inter", titleFont="Inter", labelColor=TEXT, titleColor=TEXT))


@st.cache_resource
def connection(path: str):
    return db.connect(path)


def dot_pipeline(tasks: list[dict]) -> str:
    """The DAG of the last run, with the status written in each node and not only coloured."""
    lines = ['digraph { rankdir=LR; bgcolor="transparent";',
             f'node [shape=box, style="rounded,filled", fillcolor="white", color="{CONTEXT}", '
             f'fontname="Inter", fontsize=11, fontcolor="{INK}"]; edge [color="{TEXT}", arrowsize=0.6];']
    for t in tasks:
        mark = {"success": "ok", "failed": "FAILED", "skipped": "skipped"}.get(t["status"], t["status"] or "-")
        border = ACCENT if t["status"] == "success" else INK
        lines.append(f'"{t["task"]}" [label="{t["task"]}\\n{mark} · {seconds(t["seconds"])}", color="{border}", penwidth=1.4];')
        for d in t["depends_on"]:
            lines.append(f'"{d}" -> "{t["task"]}";')
    return "\n".join(lines + ["}"])


def dot_lineage(graph: dict) -> str:
    """Objects of the warehouse grouped by layer, with their rows, and what each one reads."""
    titles = {"etls": "ETLs · landing", "processors": "Processors · gold and mart", "views": "Views · reports"}
    lines = ['digraph { rankdir=LR; bgcolor="transparent"; compound=true;',
             f'node [shape=box, style="rounded,filled", fillcolor="white", color="{CONTEXT}", '
             f'fontname="Inter", fontsize=10, fontcolor="{INK}"]; edge [color="{TEXT}", arrowsize=0.5];']
    for layer, title in titles.items():
        lines.append(f'subgraph "cluster_{layer}" {{ label="{title}"; fontname="Inter"; fontsize=11; '
                     f'fontcolor="{TEXT}"; color="{CONTEXT}"; style="rounded";')
        for n in graph["nodes"]:
            if n["layer"] == layer:
                shape = "cylinder" if n["kind"] == "table" else "box"
                border = ACCENT if n["kind"] == "table" else CONTEXT
                lines.append(f'"{n["name"]}" [shape={shape}, color="{border}", '
                             f'label="{n["name"]}\\n{n["rows"]:,} rows · {n["kind"]}"];')
        lines.append("}")
    lines += [f'"{a}" -> "{b}";' for a, b in graph["edges"]]
    return "\n".join(lines + ["}"])


def table_view(df: pd.DataFrame, label: str = "Table view") -> None:
    with st.expander(label):
        st.dataframe(df, hide_index=True, width="stretch")


# --------------------------------------------------------------------------- page
st.set_page_config(page_title="TCG DataApp", page_icon="📊", layout="wide")
settings = Settings()
try:
    con = connection(str(settings.db_path))
    info = db.overview(con)
except Exception as error:  # noqa: BLE001 - the warehouse may not exist yet
    st.error(f"The warehouse {settings.db_path} could not be read ({type(error).__name__}). "
             "Run `tcg-dataapp run` first, from the folder of the project.")
    st.stop()

head = db.headline(con)
st.title("TCG DataApp")
st.caption(f"tcg-dataapp {__version__} · warehouse `{settings.db_path}` · read-only · "
           f"captures from {utc_day(info['first_capture'])} to {utc_day(info['last_capture'])} (UTC)")
if head["top_card"] and head["top_set"]:
    c, s = head["top_card"], head["top_set"]
    st.markdown(f"On **{utc_day(info['last_capture'])}** the most valuable card is **{c['card']}** "
                f"({c['set_name']}, {c['variant']}) at **{money(c['market_price'])}**, and "
                f"**{s['set_name']}** holds **{s['share']}%** of the market value of the seven sets.")

tab_info, tab_rank, tab_time = st.tabs(["Technical infographic", "Ranking and drill-down", "Prices over time"])

# --------------------------------------------------------------------------- infographic
with tab_info:
    run = info["last_run"]
    cols = st.columns(5)
    cols[0].metric("Sets", info["sets"])
    cols[1].metric("Cards", f"{info['cards']:,}")
    cols[2].metric("Prices in the fact", f"{info['prices']:,}")
    cols[3].metric("Captures", info["captures"])
    cols[4].metric("Cells of the cube", info["cube_cells"])
    if run:
        st.markdown(f"**Last run** `{run['run_id']}`: {run['tasks_ok']} of {run['tasks']} tasks ok, "
                    f"{run['failed_attempts']} failed attempts, {run['ended_at'] - run['started_at']} s, "
                    f"started at Unix `{run['started_at']}` ({utc_day(run['started_at'])} UTC).")
    st.subheader("The pipeline of the last run")
    st.caption("Each box is a task of `pipeline.py`, read from `ops.pipeline_tasks` and `ops.pipeline_runs`; "
               "the status and the seconds are written inside the box.")
    graph = db.task_graph(con)
    st.graphviz_chart(dot_pipeline(graph["tasks"]), width="stretch",
                      alt=f"Graph of the {len(graph['tasks'])} tasks of the last run, from extraction to the report.")
    table_view(frame(graph["tasks"]), "Table view of the tasks")
    st.subheader("Lineage of the warehouse")
    st.caption("Each object reads the objects that point to it. The edges of a view come from its SQL in the "
               "catalogue (`duckdb_views()`); a frozen table keeps its source in a comment. Cylinders are tables.")
    lin = db.lineage(con)
    st.graphviz_chart(dot_lineage(lin), width="stretch",
                      alt=f"Lineage of {len(lin['nodes'])} objects of the warehouse, from db_ingestion to the reports.")
    table_view(frame(lin["nodes"]), "Table view of the objects")

# --------------------------------------------------------------------------- ranking and drill-down
with tab_rank:
    state = st.session_state
    state.setdefault("path", [])
    if "pending" in state:  # a click or a roll-up of the previous run, applied before the widgets exist
        state.path, dims_next = state.pop("pending")
        for d in db.DIMENSIONS:
            state[f"dim_{d}"] = d in dims_next
    for d in db.DIMENSIONS:
        state.setdefault(f"dim_{d}", d == "set_name")

    months = db.frozen_months(con)
    left, mid, right = st.columns([2, 2, 3])
    sources = (["frozen"] if months else []) + ["live"]
    source = left.radio("Source", sources, horizontal=True,
                        format_func=lambda s: f"frozen report {months[-1].replace('_', '-')}" if s == "frozen"
                        else "live view, last capture")
    measure = mid.selectbox("Measure", list(db.MEASURES), format_func=lambda m: db.MEASURES[m][0])
    with right:
        st.write("Group by")
        check_cols = st.columns(len(db.DIMENSIONS))
        for col, d in zip(check_cols, db.DIMENSIONS):
            col.checkbox(DIM_LABELS[d], key=f"dim_{d}")
    dims = [d for d in db.DIMENSIONS if state[f"dim_{d}"]]
    filters = dict(state.path)

    crumbs = st.container(horizontal=True)
    if crumbs.button("All sets", disabled=not state.path, help="Roll up to the top of the hierarchy"):
        state.pending = ([], ["set_name"])
        st.rerun()
    for i, (d, v) in enumerate(state.path):
        if crumbs.button(f"{DIM_LABELS[d]}: {v}", key=f"crumb_{i}", help="Roll up to this level"):
            nxt = db.HIERARCHY[min(db.HIERARCHY.index(d) + 1, len(db.HIERARCHY) - 1)] if d in db.HIERARCHY else d
            state.pending = (state.path[: i + 1], [nxt])
            st.rerun()

    result = db.explore(con, source, dims, measure, filters, suffix=months[-1] if months else None)
    df = frame(result["rows"])
    if df.empty:
        st.info("No prices for this combination.")
    else:
        df["group"] = df[dims].astype(str).agg(" · ".join, axis=1) if dims else "all"
        pick = alt.selection_point(name="pick", fields=["group"], on="click")
        bars = alt.Chart(df).mark_bar(cornerRadiusEnd=4, height={"band": 0.62}, color=ACCENT).encode(
            x=alt.X("value:Q", title=result["label"]),
            y=alt.Y("group:N", sort="-x", title=None, axis=alt.Axis(labelLimit=320)),
            opacity=alt.condition(pick, alt.value(1), alt.value(0.55)),
            tooltip=[alt.Tooltip(f"{d}:N", title=DIM_LABELS[d]) for d in dims]
                    + [alt.Tooltip("value:Q", title=result["label"], format=",.2f")],
        ).add_params(pick)
        labels = alt.Chart(df).mark_text(align="left", dx=4, color=TEXT, font="JetBrains Mono", fontSize=11).encode(
            x="value:Q", y=alt.Y("group:N", sort="-x"), text=alt.Text("value:Q", format=",.2f"))
        chart = axis_theme((bars + labels).properties(height=max(120, 30 * len(df))))
        top = df.iloc[0]
        event = st.altair_chart(chart, width="stretch", height=max(120, 30 * len(df)) + 60, theme=None,
                                alt=f"Ranked bars of {len(df)} groups; the first is {top['group']} with {float(top['value']):,.2f}.",
                                on_select="rerun",
                                key=f"bars_{source}_{measure}_{'-'.join(dims)}_{len(state.path)}")
        picked = (event.selection.get("pick") if event and event.selection else None) or []
        if picked:
            row = df[df["group"] == picked[0].get("group")].iloc[0]
            deepest = [d for d in db.HIERARCHY if d in dims]
            if deepest and deepest[-1] != "card":
                nxt = db.HIERARCHY[db.HIERARCHY.index(deepest[-1]) + 1]
                state.pending = (state.path + [(d, row[d]) for d in dims if d in db.HIERARCHY],
                                 [nxt] + (["variant"] if "variant" in dims else []))
                st.rerun()
            st.caption("The card is the lowest level of the hierarchy; use the buttons above to roll up.")
        st.caption(f"{len(df)} groups of `{result['table']}`, capture of {utc_day(result['captured_at'])} (UTC), "
                   "ranked by the measure. Click a bar to drill down set › rarity › card.")
        check = db.cube_check(con, result, dims, measure, filters)
        if check:
            st.markdown(f"**Check with the cube:** `gold.agg_price_cube` at grouping_id {check['grouping_id']} "
                        f"has {check['cells']} cells for this capture, and they "
                        + ("**agree** with the bars." if check["agree"] else "**do not agree** with the bars."))
        else:
            st.caption("The cube has no card, so a view by card cannot be checked against it.")
        table_view(df.drop(columns=["group"]))
    with st.expander("SQL of this view"):
        st.code(result["sql"] + (f"\n-- parameters: {result['params']}" if result["params"] else ""), language="sql")

# --------------------------------------------------------------------------- over time
with tab_time:
    level = st.radio("Series", ["set", "card"], horizontal=True,
                     format_func=lambda v: "market value of each set" if v == "set" else "the five most valuable cards of one set")
    sets = sorted({r["series"] for r in db.price_history(con, "set")})
    chosen_set = st.selectbox("Set", sets, index=0) if level == "card" else None
    hist = frame(db.price_history(con, level, chosen_set))
    if hist.empty:
        st.info("No prices for this set.")
    else:
        hist["day"] = pd.to_datetime(hist["captured_at"], unit="s", utc=True)
        names = sorted(hist["series"].unique())
        highlight = st.selectbox("Highlight", names, index=names.index(hist.sort_values("value").iloc[-1]["series"]))
        hist["role"] = hist["series"].eq(highlight).map({True: "highlighted", False: "other"})
        x = alt.X("day:T", title="Capture (UTC)", scale=alt.Scale(type="utc"),
                  axis=alt.Axis(format="%d/%m/%Y", labelAngle=0, tickCount=len(hist["day"].unique())))
        y = alt.Y("value:Q", title="Market value (US$)" if level == "set" else "Market price (US$)")
        base = alt.Chart(hist).encode(x=x, y=y, detail="series:N")
        context = base.transform_filter(alt.datum.role == "other").mark_line(strokeWidth=1.5, color=CONTEXT)
        main = base.transform_filter(alt.datum.role == "highlighted").mark_line(strokeWidth=2.5, color=ACCENT)
        dots = base.transform_filter(alt.datum.role == "highlighted").mark_circle(size=70, color=ACCENT, opacity=1).encode(
            tooltip=[alt.Tooltip("series:N", title="Series"), alt.Tooltip("day:T", title="Capture", format="%d/%m/%Y"),
                     alt.Tooltip("captured_at:Q", title="Unix time", format="d"),
                     alt.Tooltip("value:Q", title="US$", format=",.2f")])
        last = hist[hist["role"] == "highlighted"].sort_values("day").tail(1)
        end = alt.Chart(last).mark_text(align="left", dx=8, color=INK, font="Inter", fontSize=12, fontWeight=600).encode(
            x=x, y=y, text="series:N")
        first, final = hist[hist["role"] == "highlighted"].sort_values("day").iloc[[0, -1]]["value"]
        st.altair_chart(axis_theme((context + main + dots + end).properties(height=380)), width="stretch",
                        height=440, theme=None,
                        alt=f"Line chart over {hist['day'].nunique()} captures; {highlight} goes from "
                            f"{float(first):,.2f} to {float(final):,.2f} US$, the other series in grey.")
        st.caption(f"{highlight}: from {money(first)} to {money(final)} between the first and the last capture. "
                   "The other series stay in grey as context; the dates are drawn in UTC from the Unix time.")
        table_view(hist[["captured_at", "day", "series", "value"]].assign(day=hist["day"].dt.strftime("%d/%m/%Y")))
