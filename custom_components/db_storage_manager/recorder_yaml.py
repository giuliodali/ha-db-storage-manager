"""Read and change `recorder: purge_keep_days` in the user's YAML. No Home Assistant imports.

Home Assistant has no API for the recorder's keep-days setting: it only comes from YAML. The file
is edited as text, one line, so comments, `!secret`, `!include` and formatting stay exactly as
they were. Supported layouts:

- `recorder:` as a block in configuration.yaml (or in a package file), with or without
  `purge_keep_days` (the line is replaced, or added as the block's first line);
- `recorder: !include recorder.yaml` (the included file's top-level `purge_keep_days`);
- no `recorder:` at all (a block is appended to configuration.yaml).

Anything else (an inline mapping, `!include_dir_*`, a `!secret` as the whole block) is reported
as unsupported and nothing is written.
"""

from __future__ import annotations

import os
import re
import shutil
import tempfile
from pathlib import Path
from typing import Any, Callable

HA_DEFAULT_KEEP_DAYS = 10
KEY = "purge_keep_days"
BACKUP_SUFFIX = ".dbs_backup"

_TOP = re.compile(r"^recorder:[ \t]*(?P<rest>[^\n]*)$")
_INCLUDE = re.compile(r"^!include[ \t]+(?P<file>[^\s#]+)[ \t]*(#.*)?$")
_KEEP = re.compile(r"^(?P<ind>[ \t]*)purge_keep_days:[ \t]*(?P<val>[^#\n]*?)[ \t]*(?P<cmt>#.*)?$")
SKIP_DIRS = {"custom_components", ".storage", "deps", "backups", "www", "node_modules", "blueprints", "tts", "__pycache__"}


def _is_block_start(rest: str) -> bool:
    return rest == "" or rest.startswith("#")


def _int(val: str) -> int | None:
    try:
        return int(val.strip().strip("'\""))
    except ValueError:
        return None


def _lines(text: str) -> list[str]:
    return text.splitlines()


def _block(lines: list[str], start: int) -> tuple[int, str | None]:
    """End index (exclusive) of the block under line ``start``, and its child indent (None if empty)."""
    indent = None
    end = start + 1
    for i in range(start + 1, len(lines)):
        ln = lines[i]
        if not ln.strip() or ln.lstrip().startswith("#"):
            continue
        if not ln[0].isspace():
            break
        if indent is None:
            indent = ln[: len(ln) - len(ln.lstrip())]
        end = i + 1
    return end, indent


def _find_top(lines: list[str]) -> int | None:
    for i, ln in enumerate(lines):
        if _TOP.match(ln):
            return i
    return None


def locate(config_dir: str) -> dict[str, Any]:
    """Where the recorder's keep-days setting lives, and its configured value.

    Returns {"file", "kind": "block" | "include" | "missing" | "unsupported", "configured_days", "reason"}.
    ``configured_days`` is None when the setting is not in YAML (Home Assistant's default applies).
    Blocking: reads files. Run in an executor.
    """
    root = Path(config_dir)
    main = root / "configuration.yaml"
    try:
        text = main.read_text(encoding="utf-8")
    except OSError as err:
        return {"file": str(main), "kind": "unsupported", "configured_days": None, "reason": f"Cannot read configuration.yaml: {err}"}
    found = _locate_in(main, text, root)
    if found:
        return found
    # Not in configuration.yaml: a package file may define it.
    for path in _yaml_files(root):
        if path == main:
            continue
        try:
            t = path.read_text(encoding="utf-8")
        except OSError:
            continue
        found = _locate_in(path, t, root)
        if found:
            return found
    return {"file": str(main), "kind": "missing", "configured_days": None, "reason": None}


def _yaml_files(root: Path):
    n = 0
    for dirpath, dirs, files in os.walk(root):
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not d.startswith("."))
        for f in sorted(files):
            if f.endswith((".yaml", ".yml")) and f != "secrets.yaml":
                n += 1
                if n > 600:
                    return
                yield Path(dirpath) / f


def _locate_in(path: Path, text: str, root: Path) -> dict[str, Any] | None:
    lines = _lines(text)
    i = _find_top(lines)
    if i is None:
        return None
    rest = _TOP.match(lines[i]).group("rest").strip()
    if _is_block_start(rest):
        end, _ = _block(lines, i)
        for ln in lines[i + 1:end]:
            m = _KEEP.match(ln)
            if m and len(m.group("ind")) > 0:
                days = _int(m.group("val"))
                if days is None:
                    return {"file": str(path), "kind": "unsupported", "configured_days": None,
                            "reason": f"purge_keep_days in {path.name} is not a plain number ({m.group('val').strip()})."}
                return {"file": str(path), "kind": "block", "configured_days": days, "reason": None}
        return {"file": str(path), "kind": "block", "configured_days": None, "reason": None}
    inc = _INCLUDE.match(rest)
    if inc:
        target = (path.parent / inc.group("file")).resolve()
        try:
            target.relative_to(root.resolve())
            t = target.read_text(encoding="utf-8")
        except (OSError, ValueError) as err:
            return {"file": str(target), "kind": "unsupported", "configured_days": None, "reason": f"Cannot read the included recorder file: {err}"}
        for ln in _lines(t):
            m = _KEEP.match(ln)
            if m and m.group("ind") == "":
                days = _int(m.group("val"))
                if days is None:
                    return {"file": str(target), "kind": "unsupported", "configured_days": None,
                            "reason": f"purge_keep_days in {target.name} is not a plain number."}
                return {"file": str(target), "kind": "include", "configured_days": days, "reason": None}
        return {"file": str(target), "kind": "include", "configured_days": None, "reason": None}
    return {"file": str(path), "kind": "unsupported", "configured_days": None,
            "reason": f"recorder: in {path.name} is written as '{rest}', which cannot be edited safely. Set purge_keep_days there yourself."}


def set_keep_days(text: str, kind: str, days: int) -> str:
    """The file's text with purge_keep_days set to ``days``. Pure; line endings are kept."""
    nl = "\r\n" if "\r\n" in text else "\n"
    lines = _lines(text)
    if kind == "missing":
        body = text if not text or text.endswith(("\n", "\r")) else text + nl
        return f"{body}{nl if body.strip() else ''}recorder:{nl}  {KEY}: {days}{nl}"
    if kind == "include":
        for i, ln in enumerate(lines):
            m = _KEEP.match(ln)
            if m and m.group("ind") == "":
                lines[i] = f"{KEY}: {days}" + (f"  {m.group('cmt')}" if m.group("cmt") else "")
                return nl.join(lines) + nl
        body = text if not text or text.endswith(("\n", "\r")) else text + nl
        if body.strip() in ("", "{}"):
            body = ""
        return f"{body}{KEY}: {days}{nl}"
    if kind != "block":
        raise ValueError(f"Cannot edit a recorder setting of kind {kind}")
    i = _find_top(lines)
    if i is None:
        raise ValueError("recorder: not found")
    end, indent = _block(lines, i)
    for j in range(i + 1, end):
        m = _KEEP.match(lines[j])
        if m and m.group("ind") == indent:
            lines[j] = f"{indent}{KEY}: {days}" + (f"  {m.group('cmt')}" if m.group("cmt") else "")
            return nl.join(lines) + nl
    lines.insert(i + 1, f"{indent or '  '}{KEY}: {days}")
    return nl.join(lines) + nl


def write_keep_days(config_dir: str, days: int, validate: Callable[[Path, int], None]) -> dict[str, Any]:
    """Change the setting on disk. Blocking: run in an executor, one at a time.

    The new text goes to a private temporary file beside the original, ``validate(temp_path, days)``
    must accept it (it raises otherwise), the original is copied to ``<file>.dbs_backup`` and the
    temporary file then replaces it in one step.
    """
    loc = locate(config_dir)
    if loc["kind"] == "unsupported":
        raise ValueError(loc["reason"])
    path = Path(loc["file"])
    raw = path.read_bytes() if path.exists() else b""
    text = raw.decode("utf-8")
    new = set_keep_days(text, loc["kind"], days)
    fd, tmp = tempfile.mkstemp(prefix=f".{path.name}.", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "wb") as fh:
            fh.write(new.encode("utf-8"))
        validate(Path(tmp), days)
        if path.exists():
            shutil.copy2(path, str(path) + BACKUP_SUFFIX)
            shutil.copymode(path, tmp)
        os.replace(tmp, path)
    except BaseException:
        Path(tmp).unlink(missing_ok=True)
        raise
    return {**locate(config_dir), "backup": str(path) + BACKUP_SUFFIX if raw else None}
