import { useState } from "react";

export default function GmSecretForm({ onAdd }: any) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("unknown");

  const submit = async () => {
    if (!text.trim()) return;

    await onAdd({ text, category });

    setText("");
    setCategory("unknown");
  };

  return (
    <div className="mb-3">
      <textarea
        placeholder="Enter GM secret..."
        value={text}
        onChange={e => setText(e.target.value)}
        className="w-full border p-2"
      />

      <div className="flex justify-between mt-2">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="unknown">Unknown</option>
          <option value="lie">Lie</option>
          <option value="agenda">Agenda</option>
          <option value="hook">Plot Hook</option>
          <option value="danger">Danger</option>
        </select>

        <button onClick={submit}>Add</button>
      </div>
    </div>
  );
}
