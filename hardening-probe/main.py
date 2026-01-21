import os
import json
import argparse

from gather_info import gather_info
from process_ss import process_ss
from analysis import (
    read_last_two_records,
    analyze_risk_changes,
    summarize_findings,
)


# -------------------------
# Safe JSON loader (legacy log protection)
# -------------------------

def safe_json_load(raw):
    try:
        return json.loads(raw)
    except Exception:
        return None


# -------------------------
# Main entrypoint
# -------------------------

def main():
    parser = argparse.ArgumentParser(description="System Hardening Security Probe")

    parser.add_argument(
        "--log-path",
        default="logs/example_output.log",
        help="Path to security scan log file",
    )

    args = parser.parse_args()

    # -------------------------
    # Ensure directories exist
    # -------------------------

    log_dir = os.path.dirname(args.log_path)
    if log_dir:
        os.makedirs(log_dir, exist_ok=True)

    os.makedirs("output", exist_ok=True)

    # -------------------------
    # Load previous scan records
    # -------------------------

    previous_raw, current_raw = read_last_two_records(args.log_path)

    previous = safe_json_load(previous_raw) if previous_raw else None
    current = safe_json_load(current_raw) if current_raw else None

    if previous is None:
        print("First run detected — no previous baseline found")

    # -------------------------
    # Collect system snapshot
    # -------------------------

    snapshot = gather_info()

    # -------------------------
    # Normalize snapshot
    # -------------------------

    processed = process_ss(snapshot)

    # -------------------------
    # Analyze risk changes
    # -------------------------

    findings = analyze_risk_changes(previous, processed)
    results = summarize_findings(findings)

    # -------------------------
    # Persist new baseline record
    # -------------------------

    with open(args.log_path, "a") as f:
        f.write(json.dumps(processed) + "\n")

    # -------------------------
    # Save CI artifact report
    # -------------------------

    with open("output/security_report.json", "w") as f:
        json.dump(results, f, indent=2)

    # -------------------------
    # CI enforcement gate
    # -------------------------

    if results.get("critical", False):
        print("\nCRITICAL SECURITY ISSUES DETECTED:\n")

        for issue in results.get("critical_issues", []):
            category = issue.get("category", "unknown")
            finding = issue.get("finding", "unknown_issue")
            print(f"- {finding} ({category})")

        exit(1)

    print("Security scan completed successfully")
    exit(0)


if __name__ == "__main__":
    main()
