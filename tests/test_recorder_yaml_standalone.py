"""Standalone tests for editing recorder: purge_keep_days in YAML (no Home Assistant import)."""

from __future__ import annotations

import importlib.util
import sys
from pathlib import Path

import pytest

PKG = Path(__file__).parent.parent / "custom_components" / "db_storage_manager"
spec = importlib.util.spec_from_file_location("recorder_yaml", PKG / "recorder_yaml.py")
ry = importlib.util.module_from_spec(spec)
sys.modules["recorder_yaml"] = ry
spec.loader.exec_module(ry)


def _ok(path, days):  # stands in for Home Assistant's YAML loader
    assert f"purge_keep_days: {days}" in path.read_bytes().decode()


def test_replaces_the_value_and_keeps_comments_and_tags(tmp_path) -> None:
    cfg = tmp_path / "configuration.yaml"
    cfg.write_bytes(("default_config:\n\nrecorder:\n  db_url: !secret db  # mine\n  purge_keep_days: 10  # ten days\n  exclude:\n    domains: [sun]\nhttp:\n  server_port: 8123\n").encode())
    assert ry.locate(str(tmp_path))["configured_days"] == 10
    ry.write_keep_days(str(tmp_path), 30, _ok)
    text = cfg.read_bytes().decode()
    assert "  purge_keep_days: 30  # ten days\n" in text and "db_url: !secret db  # mine" in text and "http:\n  server_port: 8123" in text
    assert (tmp_path / "configuration.yaml.dbs_backup").read_bytes().decode().count("purge_keep_days: 10") == 1
    assert ry.locate(str(tmp_path))["configured_days"] == 30


def test_adds_the_key_to_an_existing_block_with_its_indent(tmp_path) -> None:
    cfg = tmp_path / "configuration.yaml"
    cfg.write_bytes(("recorder:\n    commit_interval: 5\nlogger:\n  default: info\n").encode())
    assert ry.locate(str(tmp_path)) == {"file": str(cfg), "kind": "block", "configured_days": None, "reason": None}
    ry.write_keep_days(str(tmp_path), 7, _ok)
    assert cfg.read_bytes().decode() == "recorder:\n    purge_keep_days: 7\n    commit_interval: 5\nlogger:\n  default: info\n"


def test_empty_block_and_missing_recorder(tmp_path) -> None:
    cfg = tmp_path / "configuration.yaml"
    cfg.write_bytes(("recorder:\nlogger:\n").encode())
    ry.write_keep_days(str(tmp_path), 5, _ok)
    assert cfg.read_bytes().decode() == "recorder:\n  purge_keep_days: 5\nlogger:\n"
    cfg.write_bytes(("default_config:\n").encode())
    assert ry.locate(str(tmp_path))["kind"] == "missing"
    ry.write_keep_days(str(tmp_path), 14, _ok)
    assert cfg.read_bytes().decode() == "default_config:\n\nrecorder:\n  purge_keep_days: 14\n"


def test_windows_line_endings_are_kept(tmp_path) -> None:
    cfg = tmp_path / "configuration.yaml"
    cfg.write_bytes(b"recorder:\r\n  purge_keep_days: 10\r\n")
    ry.write_keep_days(str(tmp_path), 20, _ok)
    assert cfg.read_bytes() == b"recorder:\r\n  purge_keep_days: 20\r\n"


def test_included_file_and_package_file(tmp_path) -> None:
    (tmp_path / "configuration.yaml").write_bytes(("recorder: !include recorder.yaml\n").encode())
    inc = tmp_path / "recorder.yaml"
    inc.write_bytes(("purge_keep_days: 3\nauto_purge: true\n").encode())
    assert ry.locate(str(tmp_path))["kind"] == "include"
    ry.write_keep_days(str(tmp_path), 9, _ok)
    assert inc.read_bytes().decode() == "purge_keep_days: 9\nauto_purge: true\n"

    (tmp_path / "configuration.yaml").write_bytes(("homeassistant:\n  packages: !include_dir_named packages\n").encode())
    inc.unlink()
    (tmp_path / "packages").mkdir()
    pkg = tmp_path / "packages" / "db.yaml"
    pkg.write_bytes(("recorder:\n  purge_keep_days: 4\n").encode())
    loc = ry.locate(str(tmp_path))
    assert loc["file"] == str(pkg) and loc["configured_days"] == 4
    ry.write_keep_days(str(tmp_path), 12, _ok)
    assert pkg.read_bytes().decode() == "recorder:\n  purge_keep_days: 12\n"


def test_unsupported_layouts_and_failed_validation_change_nothing(tmp_path) -> None:
    cfg = tmp_path / "configuration.yaml"
    cfg.write_bytes(("recorder: {purge_keep_days: 10}\n").encode())
    assert ry.locate(str(tmp_path))["kind"] == "unsupported"
    with pytest.raises(ValueError):
        ry.write_keep_days(str(tmp_path), 5, _ok)
    cfg.write_bytes(("recorder:\n  purge_keep_days: !secret keep\n").encode())
    assert ry.locate(str(tmp_path))["kind"] == "unsupported"

    cfg.write_bytes(("recorder:\n  purge_keep_days: 10\n").encode())

    def bad(path, days):
        raise ValueError("does not parse")

    with pytest.raises(ValueError):
        ry.write_keep_days(str(tmp_path), 5, bad)
    assert cfg.read_bytes().decode() == "recorder:\n  purge_keep_days: 10\n"
    assert [p.name for p in tmp_path.iterdir()] == ["configuration.yaml"]  # no temp file or backup left behind
