

# ✅ **1. Core Concept**

The app is a **retro file-navigator game**:

* Screen = **40 columns × 25 rows**, fixed-size, monospace.
* UI = **single file panel** (like the *left half* of Norton Commander).
* User can:

  * Move cursor up/down the directory list.
  * Enter a directory.
  * Go to parent directory (`..`).
* The filesystem is **virtual**, defined via JSON.
* Works on **mobile**: scroll-free, finger-friendly, but retro.

---

# ✅ **2. High-Level Architecture (React)**

```
<App>
  <RetroScreen>
      <FilePanel>
          <FileList>
              <FileRow />
          </FileList>
      </FilePanel>
  </RetroScreen>
</App>
```

### **Global State (Jotai)**

* `currentPath: string[]`
* `fs: VirtualFileSystem`
* `selectedIndex: number`
* `screenBuffer: string[][]` (optional: for real 40×25 rendering)
* `mode: 'browse' | 'command' | 'animation'`

---

# ✅ **3. Virtual Filesystem Structure**

```ts
type FSNode = {
  name: string;
  type: "dir" | "file";
  children?: FSNode[];
};

const FS: FSNode = {
  name: "/",
  type: "dir",
  children: [
    { name: "games", type: "dir", children: [...] },
    { name: "docs", type: "dir", children: [...] },
    { name: "readme.txt", type: "file" }
  ]
};
```

---

# ✅ **4. Rendering Strategy**

### **Option A: Text-mode DOM Renderer (recommended)**

Use `<pre>` with a monospace font:

```
<pre class="screen">
  ┌────────────────────────────────────┐
  │  Name            Size    Date      │
  │> ..                              │
  │  games                           │
  │  docs                            │
  │  readme.txt         12kb         │
  └────────────────────────────────────┘
</pre>
```

* Panel is exactly **40 columns** wide.
* Use Unicode box-drawing characters for the frame.

### **Option B: True Buffer Renderer**

Maintain a **40×25 array of characters** and render via `<pre>{rows.join("\n")}</pre>`.

---

# ✅ **5. Core Components**

## **RetroScreen**

A fixed 40×25 container.

```jsx
function RetroScreen({ children }) {
  return (
    <div
      style={{
        width: "40ch",
        height: "25 * 1lh",
        background: "#001b33",
        color: "#00d7ff",
        fontFamily: "monospace",
        fontSize: "16px",
        lineHeight: "1em",
        whiteSpace: "pre",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}
```

---

## **FilePanel Component**

Displays list of dir contents.

```
┌────────────────────────────────────┐
│ C:\GAMES\                          │
│────────────────────────────────────│
│> ..
│  doom/
│  duke3d/
│  readme.txt
└────────────────────────────────────┘
```

Handles:

* highlight selected row
* pad names to column width
* show `..` for parent dir
* maintain cursor position

---

# ✅ **6. Navigation Logic**

### **Move cursor**

```ts
setSelected((i) => clamp(i + direction, 0, entries.length - 1));
```

### **Enter directory**

```ts
const entry = entries[selectedIndex];

if (entry.name === "..") {
  goToParent();
} else if (entry.type === "dir") {
  setCurrentPath([...currentPath, entry.name]);
}
```

### **Get Directory Contents**

```ts
function getEntries(fs, path) {
  let node = fs;
  for (const p of path) {
    node = node.children.find(c => c.name === p);
  }

  const items = node.children ?? [];
  return [{ name: "..", type: "dir" }, ...items];
}
```

---

# ✅ **7. Mobile Interaction Model**

Since arrows/keyboard aren't ideal:

### **Touch Controls**

* Swipe up/down → move cursor
* Tap on row → open directory / view file
* Long press → open menu (copy, delete, info — if you add gameplay)

### **On-screen retro arrow keys (optional)**

A 3×3 D-pad styled like DOS UI:

```
   ↑
 ← · →
   ↓
```

---

# ✅ **8. Game Mechanics Ideas (optional)**

Your Norton Commander interface is a **frontend** for a game. Possible mechanics:

### **📁 Hidden missions inside filesystem**

* Certain directories contain story notes.
* Player finds corrupted sectors.
* You can introduce mini-quests like:

  * "Find the missing EXE"
  * "Restore fragmented data"
  * "Fix boot sequence files"

### **🕵️ Navigation puzzles**

* Some directories are “locked” until player solves tasks.
* Symbolic links redirect unexpectedly (迷宮).

### **💾 DOS-style “programs”**

When entering a special directory (e.g., `/games/pinball/`),
the app transitions to a mini-game.

---

# ✅ **9. Example UI Mockup (40×25)**

```
┌────────────────────────────────────────────┐
│ PATH: /docs                                │
│────────────────────────────────────────────│
│> ..                                        │
│  story/                                    │
│  secrets/                                  │
│  mission1.txt                              │
│  log.old                                   │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
│                                            │
└────────────────────────────────────────────┘
```

