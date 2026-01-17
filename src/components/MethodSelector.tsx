import React from "react";
import { Text } from "ink";
import { Panel } from "./Panel";

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
  focused: boolean;
  editMode: boolean;
}

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  value,
  onChange,
  focused,
  editMode,
}) => {
  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];
  
  const getMethodColor = (method: string): string => {
    switch (method) {
      case "GET": return "blue";
      case "POST": return "green";
      case "PUT": return "yellow";
      case "PATCH": return "cyan";
      case "DELETE": return "red";
      default: return "white";
    }
  };

  return (
    <Panel
      title={editMode ? "⚡ Method [↕]" : "⚡ Method"}
      focused={focused}
      editMode={editMode}
      width={20}
    >
      {editMode ? (
        <>
          {methods.map((method) => (
            <Text
              key={method}
              color={method === value ? getMethodColor(method) : "gray"}
              bold={method === value}
              dimColor={method !== value}
            >
              {method === value ? `▸ ${method}` : `  ${method}`}
            </Text>
          ))}
        </>
      ) : (
        <Text color={focused ? getMethodColor(value) : "gray"} bold={focused}>
          ▸ {value}
        </Text>
      )}
    </Panel>
  );
};
