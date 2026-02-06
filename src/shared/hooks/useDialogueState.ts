import { useState } from "react";

interface Dialogue {
  id: string;
  text: string;
  action?: string;
  motion?: string;
}

interface UseDialogueStateProps {
  dialogues: Dialogue[];
}

export function useDialogueState({ dialogues }: UseDialogueStateProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);

  const nextDialogue = () => {
    setDialogueIndex((prev) => (prev + 1) % dialogues.length);
  };

  const jumpToId = (id: string) => {
    const index = dialogues.findIndex((d) => d.id === id);
    if (index !== -1) {
      setDialogueIndex(index);
    }
  };

  return {
    dialogueIndex,
    currentDialogue: dialogues[dialogueIndex],
    nextDialogue,
    jumpToId,
    setDialogueIndex,
  };
}
