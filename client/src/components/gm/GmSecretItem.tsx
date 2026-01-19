import { analyzeNpcSecret, deleteNpcSecret } from "../../services/gmSecretApi";
import type { GmSecret } from "../../types/GmSecret";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  npcId: string;
  secret: GmSecret;
  setSecrets: Dispatch<SetStateAction<GmSecret[]>>;
}

export default function GmSecretItem({ npcId, secret, setSecrets }: Props) {
  const percent = Math.round((secret.confidence ?? 0) * 100);

  // ---------- Delete ----------

  const remove = async () => {
    try {
      await deleteNpcSecret(npcId, secret._id);

      setSecrets((prev) => prev.filter((s) => s._id !== secret._id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ---------- Reveal Toggle ----------

  const toggleReveal = () => {
    setSecrets((prev) =>
      prev.map((s) =>
        s._id === secret._id ? { ...s, revealed: !s.revealed } : s,
      ),
    );
  };

  // ---------- Analyze ----------

  const analyze = async () => {
    try {
      const result = await analyzeNpcSecret(npcId, secret._id);

      if (!result?.updatedSecret?._id) {
        console.error("Analyze failed:", result);
        return;
      }

      setSecrets((prev) =>
        prev.map((s) =>
          s._id === result.updatedSecret._id ? result.updatedSecret : s,
        ),
      );
    } catch (err) {
      console.error("Analyze error:", err);
    }
  };

  return (
    <div className="border p-2 mb-2">
      <p className={secret.revealed ? "" : "italic text-gray-400"}>
        {secret.revealed ? secret.text : "Secret Hidden"}
      </p>

      <div className="flex justify-between items-center text-sm mt-1">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-gray-200">
            {secret.category || "unknown"}
          </span>

          <div className="w-24 bg-gray-200 rounded h-2 overflow-hidden">
            <div
              className="h-2 transition-all duration-300 ease-out"
              style={{
                width: `${percent}%`,
                backgroundColor:
                  percent >= 75
                    ? "#16a34a"
                    : percent >= 50
                      ? "#a855f7"
                      : "#f59e0b",
              }}
            />
          </div>

          <span className="text-xs">{percent}%</span>
        </div>

        <div>
          <button
            onClick={toggleReveal}
            className={`ml-2 ${
              secret.revealed
                ? "text-blue-600 hover:text-blue-900"
                : "text-green-600 hover:text-green-900"
            }`}
          >
            {secret.revealed ? "Hide" : "Reveal"}
          </button>

          <button
            onClick={analyze}
            className="ml-2 text-purple-600 hover:text-purple-900"
          >
            Analyze
          </button>

          <button
            onClick={remove}
            className="ml-2 text-red-600 hover:text-red-900"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
