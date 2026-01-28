# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - heading "NPC Registry" [level=1] [ref=e5]
  - generic [ref=e6]:
    - button "+ Create NPC" [disabled] [ref=e7]
    - button "Edit NPC" [disabled] [ref=e8]
    - button "- Delete NPC" [disabled] [ref=e9]
    - button "GM Secrets" [disabled] [ref=e10]
  - generic [ref=e11]:
    - generic:
      - heading "NPCs" [level=2]
      - list:
        - listitem: Elias Turnbottom
        - listitem: Ezmiriel
        - listitem: Uriel
        - listitem: Falin
        - listitem: Danvers
        - listitem: Guul
        - listitem: Edit Test NPC
        - listitem: Smoke NPC 1769618943757
    - generic [ref=e12]: Select an NPC to view details
  - dialog "Confirm Delete" [ref=e15]:
    - generic [ref=e16]:
      - heading "Confirm Delete" [level=2] [ref=e17]
      - button "Close modal" [ref=e18]: ✕
    - generic [ref=e19]:
      - paragraph [ref=e20]: Delete Smoke NPC 1769619060808? This cannot be undone.
      - paragraph [ref=e21]: Deleted successfully.
      - button "Close" [ref=e23]
```