import { useEffect, useState } from "react";
import ModalShell from "../ModalShell";
import {
  getNpcSecrets,
  addNpcSecret,
} from "../../services/gmSecretApi";
import GmSecretList from "./GmSecretList";
import GmSecretForm from "./GmSecretForm";

interface Props {
  npcId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function GmSecretsModal({
  npcId,
  isOpen,
  onClose,
}: Props) {
  const [secrets, setSecrets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setLoading(true);

    getNpcSecrets(npcId).then(data => {
      setSecrets(data.secrets || []);
      setLoading(false);
    });
  }, [npcId, isOpen]);

  const handleAdd = async (payload: any) => {
    const updated = await addNpcSecret(npcId, payload);
    setSecrets(updated);
  };

  return (
    <ModalShell
      isOpen={isOpen}
      onClose={onClose}
      title="GM Secrets"
    >
      {loading ? (
        <p>Loading secrets...</p>
      ) : (
        <>
          <GmSecretForm onAdd={handleAdd} />
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
