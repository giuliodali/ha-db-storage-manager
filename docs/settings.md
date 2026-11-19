# Settings

The **Settings** tab shows what is configured now and lets you change it. Every change asks for confirmation first. It never edits your YAML configuration.

## Display

**Hide automations** (on by default) leaves automation entities out of the Overview figures and charts and the Entities list, so the KPIs and the lists they open always count the same entities. Pick *Automation* in the Type filter to list them anyway.

## State history (default retention)

This is Home Assistant's own setting, `recorder: purge_keep_days` (10 days if it is not set). The slider (1 to 30 days) starts at the value Home Assistant is running with and predicts the effect of a new one:

- **Shorter:** how much the states older than the new limit take up now. Home Assistant deletes them in its nightly purge once it has restarted; **Reclaim free space** then returns the room to the disk.
- **Longer:** how much the database grows until the new limit is reached, at the pace of the last week (entities with their own shorter retention rule are left out, because their rule still caps them).

The page does not change this setting for you. When you pick a different value it shows the YAML to set, for example:

```yaml
recorder:
  purge_keep_days: 14
```

with a **Copy** button and a link to the [recorder documentation](https://www.home-assistant.io/integrations/recorder/#purge_keep_days). Add it to `configuration.yaml` (or change the existing `purge_keep_days` wherever your `recorder:` configuration lives), then **restart** Home Assistant; the page offers a restart button.

## Long-term statistics

Home Assistant keeps hourly statistics (the history graphs beyond the state history, and the Energy dashboard) forever. You can limit them in 6-month steps from 6 months to 7 years, or keep them indefinitely (the default), with a separate setting for the statistics the **Energy dashboard** uses so you can keep those longer for year-on-year comparison. Energy statistics are exactly the entities the **Referenced In: Energy dashboard** filter shows: everything the Energy dashboard's configuration names (including imported statistics) plus the cost sensors it creates. Clicking the count opens the Entities tab with that filter ticked.

Each step shows how much it frees now, how much it keeps, and roughly where the size levels off.

Limits are applied **once a month**, by the first nightly retention run of the month (and by the first run after you change a limit). Rows older than the limit are deleted from the hourly statistics table in batches through the recorder. They are **not backed up**. The 5-minute statistics are untouched (Home Assistant already keeps those only for its purge window). Each trim is listed on the History tab and in the result of Run retention now.

## Orphaned entities

Nothing removes the long-term statistics of entities that no longer exist automatically (Home Assistant doesn't either). They show as **Orphaned** with the suggestion **Remove history**, in the Cleanup candidates. Clear history removes them, with a backup you can undo.
