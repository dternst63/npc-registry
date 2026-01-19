import {
  updateNpcSecret,
  deleteNpcSecret,
  analyzeNpcSecret,
} from "../../services/gmSecretApi";

export default function GmSecretItem({ npcId, secret, setSecrets }: any) {
  const percent = Math.round((secret.confidence ?? 0) * 100);
  
  const toggleReveal = async () => {
    const updated = await updateNpcSecret(npcId, secret._id, {
      revealed: !secret.revealed,
    });

    setSecrets((prev: any[]) =>
      prev.map((s) => (s._id === updated._id ? updated : s)),
    );
  };

  const remove = async () => {
    await deleteNpcSecret(npcId, secret._id);

    setSecrets((prev: any[]) => prev.filter((s) => s._id !== secret._id));
  };

  const analyze = async () => {
    const result = await analyzeNpcSecret(npcId, secret._id);

    if (!result?.updatedSecret?._id) {
      console.error("Analyze failed:", result);
      return;
    }

    setSecrets((prev: any[]) =>
      prev.map((s) =>
        s._id === result.updatedSecret._id ? result.updatedSecret : s,
      ),
    );

    console.log("Analysis notes:", result.notes);
  };

  return (
    <div className="border p-2 mb-2">
      <p>{secret.text}</p>

      <div className="flex justify-between items-center text-sm mt-1">
        <div className="flex items-center gap-2">
          {/* Category Badge */}
          <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-gray-200">
            {secret.category || "unknown"}
          </span>

          {/* Confidence Bar */}
          <div className="w-24 bg-gray-200 rounded h-2 overflow-hidden">
            <div
              className="h-2 transition-all duration-300 ease-out"
              style={{
                width: `${percent}%`,
                backgroundColor:
                  percent >= 75
                    ? "#16a34a" // green = solid intel
                    : percent >= 50
                      ? "#a855f7" // purple = uncertain
                      : "#f59e0b", // amber = risky
              }}
            />
          </div>

          {/* Percentage Label */}
          <span className="text-xs">
            {Math.round((secret.confidence ?? 0) * 100)}%
          </span>
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
