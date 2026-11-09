"""Constants for DB Storage Manager."""

DOMAIN = "db_storage_manager"
PANEL_URL_PATH = "db-storage"
STATIC_URL = "/db_storage_manager_static"
SNAPSHOT_DIR = "db_storage_manager/snapshots"
VERSION = "1.0.4"
# Bump when a release changes what a scan records or how it is read: the saved scan is then discarded and redone on start.
SCAN_VERSION = 2
RETENTION_AUTOMATION_ID = "db_storage_retention"  # id of the automation this integration maintains

CONF_SAMPLE_INTERVAL = "sample_interval"
DEFAULT_SAMPLE_INTERVAL = "daily"
SAMPLE_INTERVALS = {"hourly": 3600, "6h": 21600, "daily": 86400, "weekly": 604800}
CONF_RETENTION_ENABLED = "retention_enabled"
CONF_RETENTION_TIME = "retention_time"
DEFAULT_RETENTION_TIME = "04:35:00"
SAMPLE_INTERVAL_LABELS = {"hourly": "Every hour", "6h": "Every 6 hours", "daily": "Daily", "weekly": "Weekly"}
