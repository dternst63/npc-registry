import json
import os
from datetime import datetime, timezone
from typing import Tuple, List, Dict, Optional

def read_last_two_records(log_path):
    # First-run safety
    if not os.path.exists(log_path):
        return None, None

    with open(log_path, "r") as f:
        lines = f.readlines()

    if len(lines) < 2:
        return None, lines[-1] if lines else None

    return lines[-2], lines[-1]


def analyze_risk_changes(
    previous: Optional[dict], current: Optional[dict]
) -> List[Dict]:
    """
    Compares risk fields between two records and emits findings.
    """
    timestamp = datetime.now(timezone.utc).isoformat()
    findings = []

    if not previous or not current:
        return [
            {
                "timestamp": timestamp,
                "finding": "insufficient_data",
                "severity": "info",
                "details": "Not enough history to analyze changes",
            }
        ]

    categories = ["filesystem", "service", "network"]

    for category in categories:
        prev_risk = previous.get(category, {}).get("risk")
        curr_risk = current.get(category, {}).get("risk")

        if prev_risk is None or curr_risk is None:
            continue

        if prev_risk != curr_risk:
            findings.append(
                {
                    "timestamp": timestamp,
                    "category": category,
                    "previous_risk": prev_risk,
                    "current_risk": curr_risk,
                    "severity": "high" if curr_risk else "info",
                    "finding": (
                        f"{category}_risk_introduced"
                        if curr_risk
                        else f"{category}_risk_resolved"
                    ),
                }
            )

    if not findings:
        findings.append(
            {
                "timestamp": timestamp,
                "finding": "no_change",
                "severity": "info",
                "details": "No risk state changes detected",
            }
        )

def summarize_findings(findings: List[Dict]) -> Dict:
    """
    Converts raw findings into CI enforcement structure.
    """

    critical = []
    warnings = []

    for item in findings:
        severity = item.get("severity")

        if severity == "high":
            critical.append(item)
        elif severity == "medium":
            warnings.append(item)

    return {
        "critical": len(critical) > 0,
        "critical_issues": critical,
        "warnings": warnings,
        "all_findings": findings,
    }

