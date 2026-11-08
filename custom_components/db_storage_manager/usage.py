"""Find where entities are referenced. No Home Assistant imports so it tests standalone.

This is a text scan, not an evaluator: it finds literal entity ids (and entity registry
ids, which UI-built automations use) in YAML files, dashboards, helper config and the
Energy dashboard. It cannot see references that are computed at run time; see CAVEATS.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Any

CAVEATS = [
    "Templates that build entity ids at run time are invisible here, for example "
    "expand(), area_entities(), device_entities(), integration_entities(), "
    "states.sensor loops or 'sensor.' ~ name.",
    "Automations, scripts and scenes that target an area, device, floor or label "
    "(not the entity itself) are not matched to the entities inside them.",
    "Custom cards or integrations that read entity ids from somewhere else "
    "(a helper's text, an attribute, another card's config) are not followed.",
    "Anything outside Home Assistant is invisible: Node-RED, AppDaemon, Grafana, "
    "REST API clients, voice assistant exposure, mobile app widgets.",
    "Treat \"Not referenced\" as a hint, not proof. Disabling is reversible; "
    "deleting history is only safe with a snapshot.",
]

_DYNAMIC = [
    (re.compile(r"\bexpand\s*\("), "expand()"),
    (re.compile(r"\barea_entities\s*\("), "area_entities()"),
    (re.compile(r"\bdevice_entities\s*\("), "device_entities()"),
    (re.compile(r"\bintegration_entities\s*\("), "integration_entities()"),
    (re.compile(r"\blabel_entities\s*\("), "label_entities()"),
    (re.compile(r"\bfloor_entities\s*\("), "floor_entities()"),
    (re.compile(r"\bconfig_entry_entities\s*\("), "config_entry_entities()"),
    (re.compile(r"\bstates\s*\|"), "states | filter"),
    (re.compile(r"""['"][a-z_]+\.['"]\s*~|~\s*['"]\.['"]"""), "built entity id"),
]
_DOMAIN_WIDE = re.compile(r"\bstates\.([a-z_]+)(?![a-z0-9_.(\[])")


def _where_text(wheres: list[str], limit: int = 3) -> str:
    """Distinct labels in order, with a count when the same label repeats (two gauge cards)."""
    counts: dict[str, int] = {}
    for w in wheres:
        counts[w] = counts.get(w, 0) + 1
    parts = [w if n == 1 else f"{w} x{n}" for w, n in counts.items()]
    more = f" and {len(parts) - limit} more" if len(parts) > limit else ""
    return ", ".join(parts[:limit]) + more


@dataclass
class Usage:
    """Accumulates where each entity is referenced."""

    locations: dict[str, list[dict[str, Any]]] = field(default_factory=dict)
    dynamic_sources: list[dict[str, Any]] = field(default_factory=list)
    domain_wide: dict[str, list[str]] = field(default_factory=dict)
    sources_scanned: dict[str, int] = field(default_factory=dict)

    def add(
        self, kind: str, name: str, link: str | None, hits: dict[str, list[str]],
        group_meta: dict[str, dict[str, Any]] | None = None,
    ) -> None:
        """Record where entities were found.

        ``group_meta`` maps the first path segment of a location (a dashboard view, for
        example ``view "Energy"``) to {"icon", "link"}. When given, each entity gets one
        location per group so every tab can show its own icon and link.
        """
        self.sources_scanned[kind] = self.sources_scanned.get(kind, 0) + 1
        for eid, wheres in hits.items():
            if group_meta is None:
                self.locations.setdefault(eid, []).append(
                    {"kind": kind, "name": name, "link": link, "where": _where_text(wheres), "refs": len(wheres)}
                )
                continue
            groups: dict[str, list[str]] = {}
            for w in wheres:
                groups.setdefault(w.split(" > ", 1)[0], []).append(w.split(" > ", 1)[1] if " > " in w else "")
            for key, rest in groups.items():
                meta = group_meta.get(key, {})
                self.locations.setdefault(eid, []).append({
                    "kind": kind, "name": name, "link": meta.get("link") or link,
                    "where": ", ".join(x for x in [key, _where_text([r for r in rest if r])] if x),
                    "icon": meta.get("icon"), "refs": len(rest),
                })

    def add_dynamic(self, kind: str, name: str, link: str | None, what: set[str]) -> None:
        if what:
            self.dynamic_sources.append(
                {"kind": kind, "name": name, "link": link, "what": sorted(what)}
            )
        for w in list(what):
            if w.startswith("states."):
                self.domain_wide.setdefault(w[7:], []).append(name)

    def summary(self, eid: str, domain: str) -> dict[str, Any]:
        locs = self.locations.get(eid, [])
        kinds = sorted({loc["kind"] for loc in locs})
        return {
            "used_in": kinds or ["Not referenced"],
            # Every reference counts: each line in a YAML file, each card on a dashboard view.
            "used_count": sum(loc.get("refs", 1) for loc in locs),
            "dynamic_possible": len(self.domain_wide.get(domain, [])),
        }


class Matcher:
    """Finds known entity ids and registry ids in text."""

    def __init__(self, entity_ids: set[str], registry_ids: dict[str, str] | None = None,
                 unique_ids: dict[str, str] | None = None, slugs: dict[str, list[str]] | None = None,
                 slugify=None) -> None:
        self.entity_ids = entity_ids
        self.registry_ids = registry_ids or {}
        # Entities defined in YAML never appear by id in their own definition (an sql or
        # command_line sensor only has a name or unique_id), so those two keys are matched too.
        self.unique_ids = unique_ids or {}
        self.slugs = slugs or {}
        self._slug = slugify or (lambda t: re.sub(r"[^a-z0-9]+", "_", t.lower()).strip("_"))
        domains = sorted({e.split(".", 1)[0] for e in entity_ids if "." in e}, key=len, reverse=True)
        doms = "|".join(re.escape(d) for d in domains) or "(?!)"
        self._re = re.compile(
            rf"(?<![A-Za-z0-9_])(?:(?P<eid>(?:{doms})\.[a-z0-9_]+)|(?P<rid>[0-9a-f]{{32}}))(?![A-Za-z0-9_])",
            re.IGNORECASE,
        )

    def find(self, text: str) -> set[str]:
        found: set[str] = set()
        for m in self._re.finditer(text):
            if m.group("eid"):
                eid = m.group("eid").lower()
                if eid in self.entity_ids:
                    found.add(eid)
            else:
                eid = self.registry_ids.get(m.group("rid").lower())
                if eid:
                    found.add(eid)
        return found


    def find_defs(self, line: str) -> set[str]:
        """YAML-defined entities whose unique_id or name this line gives."""
        m = _DEF.match(line)
        if not m or not (self.unique_ids or self.slugs):
            return set()
        val = _yaml_text(m.group(2))
        if m.group(1) == "unique_id":
            eid = self.unique_ids.get(val)
            return {eid} if eid else set()
        return set(self.slugs.get(self._slug(val), []))


def dynamic_in(text: str) -> set[str]:
    out = {label for rx, label in _DYNAMIC if rx.search(text)}
    for m in _DOMAIN_WIDE.finditer(text):
        out.add(f"states.{m.group(1)}")
    return out


def scan_lines(matcher: Matcher, lines: list[str], first_line: int = 1, defs: bool = False) -> tuple[dict[str, list[str]], set[str]]:
    hits: dict[str, list[str]] = {}
    dyn: set[str] = set()
    for i, line in enumerate(lines):
        if line.lstrip().startswith("#"):
            continue
        for eid in matcher.find(line):
            hits.setdefault(eid, []).append(f"line {first_line + i}")
        if defs:
            for eid in matcher.find_defs(line) - matcher.find(line):
                hits.setdefault(eid, []).append(f"line {first_line + i} (defined here)")
        dyn |= dynamic_in(line)
    return hits, dyn


_DEF = re.compile(r"^\s*(?:-\s+)?(unique_id|name):\s*(.+?)\s*$")
_ALIAS = re.compile(r"^\s*(?:-\s+)?(?:alias|name):\s*(.+?)\s*$")
_ID = re.compile(r"^\s*(?:-\s+)?id:\s*['\"]?([^'\"\s#]+)")


def _yaml_text(raw: str) -> str:
    """Decode a YAML scalar, so an escape such as \\U0001F976 in a quoted name shows as the emoji."""
    try:
        import yaml  # PyYAML ships with Home Assistant

        val = yaml.safe_load(raw)
        if isinstance(val, (str, int, float)) and not isinstance(val, bool):
            return str(val)
    except Exception:  # noqa: BLE001
        pass
    return raw.strip("'\"")


def split_yaml_items(lines: list[str], style: str) -> list[dict[str, Any]]:
    """Split automations.yaml/scenes.yaml (style 'list') or scripts.yaml (style 'dict')."""
    start_rx = re.compile(r"^- ") if style == "list" else re.compile(r"^([A-Za-z0-9_]+):\s*(?:#.*)?$")
    starts = [i for i, ln in enumerate(lines) if start_rx.match(ln)]
    items = []
    for n, s in enumerate(starts):
        end = starts[n + 1] if n + 1 < len(starts) else len(lines)
        chunk = lines[s:end]
        key = start_rx.match(lines[s]).group(1) if style == "dict" else None
        alias = next((_yaml_text(m.group(1)) for ln in chunk if (m := _ALIAS.match(ln))), None)
        ident = key or next((m.group(1) for ln in chunk if (m := _ID.match(ln))), None)
        items.append({"start": s, "end": end, "name": alias or ident or f"item {n + 1}", "id": ident})
    return items


def walk_strings(obj: Any, path: tuple = ()):
    """Yield (string, path) for every string leaf, including dict keys that look like ids."""
    if isinstance(obj, str):
        yield obj, path
    elif isinstance(obj, dict):
        for k, v in obj.items():
            if isinstance(k, str):
                yield k, path + (f"{k}(key)",)
            yield from walk_strings(v, path + (k,))
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            yield from walk_strings(v, path + (i,))


def scan_json(matcher: Matcher, obj: Any, label=None) -> tuple[dict[str, list[str]], set[str]]:
    hits: dict[str, list[str]] = {}
    seen: set[tuple[str, tuple]] = set()
    dyn: set[str] = set()
    for s, path in walk_strings(obj):
        found = matcher.find(s)
        if found:
            where = (label or generic_label)(obj, path)
            key = _ref_key(path)
            for eid in found:
                hits.setdefault(eid, [])
                if (eid, key) not in seen:  # one reference per card, however many fields name the entity
                    seen.add((eid, key))
                    hits[eid].append(where)
        dyn |= dynamic_in(s)
    return hits, dyn


def _ref_key(path: tuple) -> tuple:
    """The path up to the card (or badge, section, element) that holds a reference."""
    cut = 0
    for i, seg in enumerate(path[:-1]):
        if seg in ("cards", "badges", "sections", "elements") and isinstance(path[i + 1], int):
            cut = i + 2
    return tuple(path[:cut]) if cut else tuple(path)


def generic_label(_root: Any, path: tuple) -> str:
    out = ""
    for p in path:
        out += f"[{p}]" if isinstance(p, int) else (("." if out else "") + str(p))
    return out


def lovelace_label(root: Any, path: tuple) -> str:
    """Human label like: view "Energy" > card gauge, from a dashboard config path."""
    parts: list[str] = []
    node = root
    i = 0
    while i < len(path):
        seg = path[i]
        try:
            node = node[seg]
        except (KeyError, IndexError, TypeError):
            break
        if seg == "views" and i + 1 < len(path) and isinstance(path[i + 1], int):
            view = node[path[i + 1]]
            parts.append(f'view "{view.get("title") or view.get("path") or path[i + 1]}"')
            node = view
            i += 2
            continue
        if seg in ("cards", "badges", "sections") and i + 1 < len(path) and isinstance(path[i + 1], int):
            item = node[path[i + 1]]
            kind = item.get("type") if isinstance(item, dict) else None
            parts.append(f"{seg[:-1]} {kind or path[i + 1]}")
            node = item
            i += 2
            continue
        i += 1
    return " > ".join(parts) or generic_label(root, path)


def view_meta(conf: Any, url_path: str | None) -> dict[str, dict[str, Any]]:
    """Map a dashboard's view label (as lovelace_label writes it) to its icon and link."""
    out: dict[str, dict[str, Any]] = {}
    views = conf.get("views") if isinstance(conf, dict) else None
    if not isinstance(views, list):
        return out
    base = f"/{url_path}" if url_path else "/lovelace"
    for i, view in enumerate(views):
        if not isinstance(view, dict):
            continue
        label = f'view "{view.get("title") or view.get("path") or i}"'
        out[label] = {"icon": view.get("icon"), "link": f"{base}/{view.get('path') or i}"}
    return out


def merge_locations(usage: Usage, entity_ids: list[str]) -> list[dict[str, Any]]:
    """Distinct places where any of these entities appear, each with how many of them are there."""
    out: dict[tuple, dict[str, Any]] = {}
    for eid in entity_ids:
        for loc in usage.locations.get(eid, []):
            key = (loc["kind"], loc["name"], loc.get("link"))
            m = out.setdefault(key, {**loc, "where_parts": [], "entities": []})
            for part in [p for p in (loc.get("where") or "").split(", ") if p]:
                if part not in m["where_parts"]:
                    m["where_parts"].append(part)
            if eid not in m["entities"]:
                m["entities"].append(eid)
    res = []
    for m in out.values():
        parts = m.pop("where_parts")
        m["where"] = ", ".join(parts[:4]) + (f" and {len(parts) - 4} more" if len(parts) > 4 else "")
        m["count"] = len(m["entities"])
        res.append(m)
    return sorted(res, key=lambda m: (m["kind"], m["name"], m.get("link") or ""))
