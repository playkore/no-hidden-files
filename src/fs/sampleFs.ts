import type { FileSystem } from "./types";

export const sampleFs: FileSystem = {
  name: "/",
  type: "dir",
  date: "1993-12-10",
  children: [
    {
      name: "games",
      type: "dir",
      date: "1993-12-10",
      children: [
        {
          name: "qbert",
          type: "dir",
          date: "1989-05-10",
          children: [
            {
              name: "qbert.exe",
              type: "file",
              size: 90112,
              date: "1989-05-10",
              executableId: "qbert",
            },
            {
              name: "pyramid.dat",
              type: "file",
              size: 16384,
              date: "1989-05-08",
            },
            {
              name: "sprites.qb",
              type: "file",
              size: 24576,
              date: "1989-05-07",
            },
            {
              name: "sounds.bin",
              type: "file",
              size: 8192,
              date: "1989-05-05",
            },
            { name: "qbert.cfg", type: "file", size: 512, date: "1989-05-01" },
            {
              name: "readme.txt",
              type: "file",
              size: 1792,
              date: "1989-05-01",
              content: `QBERT README

Use arrow keys to bounce Q*bert around the pyramid.
Avoid Coily, Ugg and Wrong Way.
Use disks to escape danger and finish levels fast!`,
            },
          ],
        },
        {
          name: "elite",
          type: "dir",
          date: "1984-09-20",
          children: [
            {
              name: "elite.exe",
              type: "file",
              size: 327680,
              date: "1984-09-20",
              executableId: "elite",
            },
            {
              name: "manual.txt",
              type: "file",
              size: 40960,
              date: "1984-09-15",
              content: `ELITE FLIGHT MANUAL

1. Launch from Lave station.
2. Buy fuel and missiles before leaving.
3. Scoop cargo from debris clouds carefully.
4. Dock with gentle thrust - trust the compass.`,
            },
            { name: "lave.map", type: "file", size: 8192, date: "1984-09-12" },
          ],
        },
        {
          name: "pinball",
          type: "dir",
          date: "1992-04-21",
          children: [
            {
              name: "pinball.exe",
              type: "file",
              size: 524288,
              date: "1992-04-21",
              executableId: "pinball",
            },
            {
              name: "scores.dat",
              type: "file",
              size: 4096,
              date: "1992-04-18",
            },
            { name: "config.ini", type: "file", size: 512, date: "1992-04-15" },
          ],
        },
        {
          name: "tictactoe",
          type: "dir",
          date: "1991-02-11",
          children: [
            {
              name: "tictacto.exe",
              type: "file",
              size: 65536,
              date: "1991-02-11",
              executableId: "tictactoe",
            },
            {
              name: "readme.txt",
              type: "file",
              size: 2048,
              date: "1991-02-05",
              content: `TICTACTOE README

Beat the AI by forcing forks.
Use the numpad layout to place moves:
7 8 9
4 5 6
1 2 3`,
            },
            { name: "ai.dat", type: "file", size: 1024, date: "1991-02-01" },
          ],
        },
      ],
    },
    {
      name: "docs",
      type: "dir",
      date: "1993-12-01",
      children: [
        {
          name: "story",
          type: "dir",
          date: "1993-11-12",
          children: [
            {
              name: "chapter1.txt",
              type: "file",
              size: 2048,
              date: "1993-11-12",
              content: `CHAPTER ONE

Night settled over the colony as the last shuttle departed.
In the silence, the signal began pulsing from deep beneath the ice.`,
            },
          ],
        },
        {
          name: "mission1.txt",
          type: "file",
          size: 4096,
          date: "1993-12-01",
          content: `MISSION ORDERS

Primary Objective: Recover the lost navigation chip.
Secondary Objective: Keep damage below 20%.
Abort code: DELTA-BLUE.`,
        },
      ],
    },
    {
      name: "readme.txt",
      type: "file",
      size: 1024,
      date: "1993-12-10",
      content: `SYSTEM README

Welcome to the shareware disk!
Use cursor keys to explore directories.
Press ENTER to run games or VIEW to inspect docs.`,
    },
  ],
};
