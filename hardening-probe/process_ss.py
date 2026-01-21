import socket
from datetime import datetime, timezone
from typing import Dict


def process_ss(snapshot: Dict) -> Dict:
    """
    Normalizes and structures gathered system data.
    Pure function: NO file I/O.
    """

    log_record = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "host": socket.gethostname(),
        "filesystem": snapshot.get("filesystem"),
        "service": snapshot.get("service"),
        "network": snapshot.get("network"),
    }

    return log_record
