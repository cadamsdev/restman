interface InstructionsProps {
  editMode: boolean;
}

export function Instructions({ editMode }: InstructionsProps) {
  if (editMode) {
    return (
      <box
        style={{
          width: '100%',
          paddingLeft: 1,
          paddingRight: 1,
        }}
      >
        <text fg="#CC8844">
          EDIT MODE: Type to edit | ESC: Exit edit mode | Enter: Submit
        </text>
      </box>
    );
  }

  return (
    <box
      style={{
        width: '100%',
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <text fg="#888888">
        Tab/↑↓: Navigate | e: Edit | v: Environments | s: Save | h: History | Enter: Send | 1-4: Quick Nav | q: Quit
      </text>
    </box>
  );
}
