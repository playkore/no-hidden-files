import type { ComponentType } from "react";
import { QbertGame } from "../components/games/qbert/QbertGame";

export interface ExecutableComponentProps {
  onClose: () => void;
}

type ExecutableComponent = ComponentType<ExecutableComponentProps>;

export type ExecutableId = "qbert";

const executableRegistry = {
  qbert: QbertGame,
} satisfies Record<string, ExecutableComponent>;

export function getExecutableComponent(id: ExecutableId): ExecutableComponent {
  return executableRegistry[id];
}
