# Finding things

## Search and filters

The search box matches names and entity ids as you type. The filter column on the left shows each value with its size and entity count; ticking one narrows the list and redraws the others. Filters are:

| Filter | Meaning |
|---|---|
| **Suggestion** | What the tool advises (see below) |
| **Referenced In 🔗** | Where the entity is used: Automation, Script, Scene, Dashboard, Helper, Energy, YAML config, or **Not referenced** |
| **Integration**, **Device**, **Type** | Where it comes from and its domain |
| **Defined in** | Integration, Helper, YAML, YAML (no unique ID), External statistics |
| **Retention** | Default, or the days of a retention rule (for example "3 days") |
| **Status** | Active, Disabled, Orphaned (history only), External |
| **Last update** | This week, 1 to 6 months, 6+ months |

"N more" at the bottom of a list expands it. Automations are hidden by default (they are rarely the problem); untick **Hide automations** or filter on Type: automation to see them.

## Suggestions

Hover a badge for the confidence and reasons.

| Suggestion | Meaning |
|---|---|
| **Remove history** | The entity is gone or disabled (or imported statistics have stopped updating) and nothing references it, so its history is leftover. |
| **Disable** | Unreferenced and silent or unavailable for a long time. Disabling stops it recording. |
| **Remove from YAML** | Defined in YAML without a unique ID, so Home Assistant can't disable it. Remove its entry from your YAML to stop it recording. |
| **Review** | Unreferenced but still updating, or referenced only dynamically. Look before acting. |
| **Keep** | Referenced in your configuration. |

Suggestions are advice from a text scan. See the limits below.

## Referenced In

The pill on each row (`3 🔗`) is the number of places the entity is referenced; click it to see where, with links. Every reference counts: each line in a YAML file, each card on a dashboard view, each automation, script, scene or helper. With several rows ticked, the dialog shows the combined places with a ×N counter.

Entities defined in YAML (`sql`, `command_line`, `template`, and others) are matched by their `name` or `unique_id` in your YAML files, shown as "line N (defined here)".

**Limits.** The scan matches literal entity ids. It can't see `expand()`, `states.sensor`, ids built in a template, area, device or label targets, or anything outside Home Assistant. Entities in a domain that such a template uses show "+N dynamic".

## Size bars

Each size bar is split into **states and attributes** and **long-term statistics**. Hover the (?) beside the Size header for the legend, and a size for the exact split. Sizes for one entity are estimates scaled so they add up to the real table sizes.

## What caused a spike?

Drag across the **Database size over time** chart on the Overview. Entities shows only the entities that wrote data in that period, sized by what they wrote. The bar reads "≈ X MB of Y entities changed between A and B", with the clear button on the right and the detail in the (i) tooltip. Detailed state history only exists for the recorder's retention window (10 days by default), so older periods show statistics only.

## Inspector

The table icon on a row opens the raw stored data: **State history** (list on the left, full detail on the right, attributes as collapsible JSON), **Hourly statistics** and **5-minute statistics**. It is read-only and paged.
