// src/components/NpcList.tsx
// src/components/NpcList.tsx
import type { Npc } from "../types/Npc";

interface NpcListProps {
  npcs: Npc[];
  selectedId: string | null;
  onSelect: (npc: Npc) => void;
  isDisabled?: boolean;
}

const NpcList = ({ npcs, selectedId, onSelect, isDisabled }: NpcListProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">NPCs</h2>

      <ul className="space-y-2">
        {npcs.map((npc) => (
          <li
            key={npc.id}
            onClick={() => !isDisabled && onSelect(npc)}
            className={`cursor-pointer rounded px-3 py-2 text-sm
              ${
                npc.id === selectedId
                  ? "bg-gray-200 font-medium"
                  : "hover:bg-gray-100"
              }
            `}
          >
            {npc.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NpcList;
