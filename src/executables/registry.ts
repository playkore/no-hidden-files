import type { ComponentType } from "react";
import BombermanGame from "../components/games/Bomberman/BombermanGame";
import Elite from "../components/games/Elite";
import Pinball from "../components/games/Pinball";
import TicTacToe from "../components/games/TicTacToe";
import { QbertGame } from "../components/games/qbert/QbertGame";

export interface ExecutableComponentProps {
  onClose: () => void;
}

type ExecutableComponent = ComponentType<ExecutableComponentProps>;

export type ExecutableId =
  | "qbert"
  | "elite"
  | "pinball"
  | "tictactoe"
  | "bomberman";

const executableRegistry = {
  qbert: QbertGame,
  elite: Elite,
  pinball: Pinball,
  tictactoe: TicTacToe,
  bomberman: BombermanGame,
} satisfies Record<string, ExecutableComponent>;

export function getExecutableComponent(id: ExecutableId): ExecutableComponent {
  return executableRegistry[id];
}
