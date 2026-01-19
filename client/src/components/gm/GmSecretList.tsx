import type { GmSecret } from "../../types/GmSecret";
import GmSecretItem from "./GmSecretItem";

interface Props {
  npcId: string;
  secrets: GmSecret[];
  setSecrets: React.Dispatch<React.SetStateAction<GmSecret[]>>;
}

export default function GmSecretList({ npcId, secrets, setSecrets }: Props) {
  if (!Array.isArray(secrets)) {
    return null;
  }

  return (
    <>
      {secrets.map((secret) => (
        <GmSecretItem
          key={secret._id}
          npcId={npcId}
          secret={secret}
          setSecrets={setSecrets}
        />
      ))}
    </>
  );
}
