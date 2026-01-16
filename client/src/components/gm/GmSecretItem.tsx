import {
  updateNpcSecret,
  deleteNpcSecret,
  analyzeNpcSecret,
} from "../../services/gmSecretApi";

export default function GmSecretItem({ npcId, secret, setSecrets }: any) {
  const toggleReveal = async () => {
    const updated = await updateNpcSecret(npcId, secret._id, {
      revealed: !secret.revealed,
    });

    setSecrets((prev: any[]) =>
      prev.map((s) => (s._id === updated._id ? updated : s))
    );
  };

  const remove = async () => {
    await deleteNpcSecret(npcId, secret._id);

    setSecrets((prev: any[]) => prev.filter((s) => s._id !== secret._id));
  };

  const analyze = async () => {
    const result = await analyzeNpcSecret(npcId, secret._id);

    setSecrets((prev: any[]) =>
      prev.map((s) =>
        s._id === result.updatedSecret._id ? result.updatedSecret : s
      )
    );

    console.log("Analysis notes:", result.notes);
  };

  return (
    <div className="border p-2 mb-2">
      <p>{secret.text}</p>

      <div className="flex justify-between text-sm mt-1">
        <span>Confidence: {secret.confidence}</span>

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
          <button onClick={analyze} className="ml-2 text-purple-600 hover:text-purple-900">
            Analyze
          </button>

          <button onClick={remove} className="ml-2 text-red-600 hover:text-red-900">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
