import GmSecretItem from "./GmSecretItem";

export default function GmSecretList({
  npcId,
  secrets,
  setSecrets,
}: any) {
  return (
    <div>
      {secrets.map((secret: any) => (
        <GmSecretItem
          key={secret._id}
          npcId={npcId}
          secret={secret}
          setSecrets={setSecrets}
        />
      ))}
    </div>
  );
}
