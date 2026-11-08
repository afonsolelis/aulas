"""The Streamlit app runs end to end over the fake warehouse (skipped without the extra 'app')."""
import pytest

from tcg_dataapp import pipeline

from conftest import FakeClient

testing = pytest.importorskip("streamlit.testing.v1")


def test_the_app_renders_every_tab_without_errors(settings, monkeypatch):
    pipeline.run(settings, client=FakeClient(), echo=lambda _: None)
    monkeypatch.setenv("TCG_DB_PATH", str(settings.db_path))
    from importlib import resources
    app = testing.AppTest.from_file(str(resources.files("tcg_dataapp.views").joinpath("app.py")), default_timeout=30)
    app.run()
    assert not app.exception
    assert [m.value for m in app.metric][:4] == ["2", "3", "6", "2"]
    assert "Card B" in app.markdown[0].value  # the headline names the most valuable card
    app.checkbox(key="dim_rarity").check().run()
    assert not app.exception
