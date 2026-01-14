// src/components/NpcCard.tsx
// src/components/NpcCard.tsx
import type { Npc } from "../../types/Npc";

interface NpcCardProps {
  npc: Npc | null;
}

const NpcCard = ({ npc }: NpcCardProps) => {
  if (!npc) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-gray-500 italic">
        Select an NPC to view details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-semibold">{npc.name}</h2>
        <p className="text-sm text-gray-600">
          {npc.role} · {npc.race}
        </p>
      </div>

      <div>
        <h3 className="font-medium text-gray-700">Descriptor</h3>
        <p>{npc.descriptor}</p>
      </div>

      <div>
        <h3 className="font-medium text-gray-700">GM Notes</h3>
        <p className="text-sm text-gray-800 whitespace-pre-line">
          {npc.agenda}
        </p>
      </div>
    </div>
  );
};

export default NpcCard;
