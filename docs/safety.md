# How it stays safe

## What it never does

- **It never deletes entities.** Disabling keeps the registry entry, which is what stops an integration re-creating the entity next time it starts. Clearing history never touches the entity itself.
- **It never edits `configuration.yaml`.** YAML-defined entities stay defined; the panel only points them out.
- **It never touches long-term statistics through retention.** Rules limit detailed states only.
- **It never writes to the recorder database directly** except through the recorder's own services and tasks, and read-only queries to measure it.

## What it does, and how that is protected

| Change | Protection |
|---|---|
| Disable an entity | Undo re-enables it (only if still disabled by that action) |
| Clear statistics and state history | One compressed backup per action first; undo restores missing rows without duplicating |
| Retention clean-up on rule creation | Backed up and undoable |
| Nightly retention | A rolling window, **not** backed up, limited to entities with rules, never longer than Home Assistant's own limit |
| Repack | The recorder's own purge with repack |
| The maintained automation | One entry in `automations.yaml`, written atomically, other entries preserved |

Other protections: previews before every action; a typed count for large batches; refusal when the disk can't hold the backup; one action at a time; actions cut short by a restart are marked Interrupted; the panel and its commands are admin-only.

## Check before you trust a suggestion

Suggestions come from a text scan of your configuration. Look at the Referenced In list and the reasons first, especially for **Review**. Dynamic templates and things outside Home Assistant can use an entity the scan can't see. Undo exists for exactly this.

## Ideas, not features

Removing registry entries for entities whose integration no longer provides them is deliberately not offered.
