import pytest

from tcg_dataapp.cli import main


def test_version(capsys):
    with pytest.raises(SystemExit) as stop:
        main(["--version"])
    assert stop.value.code == 0
    assert "tcg-dataapp 0.5.0" in capsys.readouterr().out
