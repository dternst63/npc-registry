import { useCallback, useEffect, useState } from "react";
import ModalShell from "../ModalShell";
import {
  getNpcSecrets,
  addNpcSecret,
  generateNpcSecret,
} from "../../services/gmSecretApi";
import GmSecretList from "./GmSecretList";
import GmSecretForm from "./GmSecretForm";
import type { GmSecret } from "../../types/GmSecret";

interface Props {
  npcId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GmSecretsModal({ npcId, isOpen, onClose }: Props) {
  const [secrets, setSecrets] = useState<GmSecret[]>([]);
  const [generating, setGenerating] = useState(false);
  const [loading, setLoading] = useState(false);
  const loadSecrets = useCallback(async () => {
    setLoading(true);

    try {
      const data = await getNpcSecrets(npcId);

      if (Array.isArray(data.secrets)) {
        setSecrets(data.secrets);
      } else {
        console.error("Invalid secrets load:", data);
        setSecrets([]);
      }
    } catch (err) {
      console.error("Load secrets failed:", err);
      setSecrets([]);
    } finally {
      setLoading(false);
    }
  }, [npcId]);

  useEffect(() => {
    if (isOpen) {
      loadSecrets();
    }
  }, [isOpen, loadSecrets]);

  const handleAdd = async (payload: { text: string; category: string }) => {
    const updated = await addNpcSecret(npcId, payload);
    if (Array.isArray(updated.secrets)) {
      setSecrets(updated.secrets);
    } else if (Array.isArray(updated)) {
      setSecrets(updated);
    } else {
      console.error("Invalid add response:", updated);
    }
  };

  const handleGenerateSecret = async () => {
    try {
      setGenerating(true);

      const data = await generateNpcSecret(npcId);

      if (!data) {
        alert("All unique secrets for this category have been generated.");
        return;
      }

      if (Array.isArray(data.secrets)) {
        setSecrets(data.secrets);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <ModalShell isOpen={isOpen} onClose={onClose} title="GM Secrets">
      {loading ? (
        <p>Loading secrets...</p>
      ) : (
        <>
          <GmSecretForm onAdd={handleAdd} />
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">GM Secrets</h3>

            <button
              onClick={handleGenerateSecret}
              disabled={generating}
              className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-800"
            >
              {generating ? "Generating..." : "Generate Secret"}
            </button>
          </div>

          <GmSecretList
            npcId={npcId}
            secrets={secrets}
            setSecrets={setSecrets}
          />
        </>
      )}
    </ModalShell>
  );
}
