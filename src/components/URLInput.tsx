import React from "react";
import { Text } from "ink";
import TextInput from "ink-text-input";
import { Panel } from "./Panel";

interface URLInputProps {
  value: string;
  onChange: (value: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const URLInput: React.FC<URLInputProps> = ({
  value,
  onChange,
  focused,
  editMode,
}) => {
  return (
    <Panel
      title="🌐 URL"
      focused={focused}
      editMode={editMode}
      flexGrow={1}
    >
      {editMode ? (
        <TextInput value={value} onChange={onChange} />
      ) : (
        <Text color={value ? "cyan" : "gray"} italic={!value}>
          {value || "Enter URL..."}
        </Text>
      )}
    </Panel>
  );
};
