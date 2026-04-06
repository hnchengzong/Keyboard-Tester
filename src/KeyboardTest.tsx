import { useState, useEffect } from "react";

export default function KeyboardTest({ isTesting }: { isTesting: boolean }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [inputLog, setInputLog] = useState<string[]>([]);

  const keyboardRows = [
    ["escape", "f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11", "f12"],
    ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "backspace"],
    ["tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
    ["capslock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "enter"],
    ["shiftleft", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "shiftright"],
    ["controlleft", "metaleft", "altleft", " ", "altright", "controlright", "arrowup", "arrowleft", "arrowdown", "arrowright"],
    ["numlock", "numpaddivide", "numpadmultiply", "numpadsubtract"],
    ["numpad7", "numpad8", "numpad9", "numpadadd"],
    ["numpad4", "numpad5", "numpad6"],
    ["numpad1", "numpad2", "numpad3", "numpadequals"],
    ["numpad0", "numpaddot", "numpadenter"],
  ];

  const displayNames: Record<string, string> = {
    escape: "Esc",
    backspace: "Backspace",
    tab: "Tab",
    capslock: "Caps",
    enter: "Enter",
    shiftleft: "Shift",
    shiftright: "Shift",
    controlleft: "Ctrl",
    controlright: "Ctrl",
    metaleft: "Win",
    altleft: "Alt",
    altright: "Alt",
    " ": "Space",
    arrowup: "↑",
    arrowleft: "←",
    arrowdown: "↓",
    arrowright: "→",
    numlock: "NumLock",
    numpaddivide: "/",
    numpadmultiply: "*",
    numpadsubtract: "-",
    numpadadd: "+",
    numpadequals: "=",
    numpad0: "0",
    numpad1: "1",
    numpad2: "2",
    numpad3: "3",
    numpad4: "4",
    numpad5: "5",
    numpad6: "6",
    numpad7: "7",
    numpad8: "8",
    numpad9: "9",
    numpaddot: ".",
    numpadenter: "Enter",
  };

  const getKeyList = (key: string): string[] => {
    const map: Record<string, string[]> = {
      ctrl: ["controlleft", "controlright", "control"],
      shift: ["shiftleft", "shiftright", "shift"],
      alt: ["altleft", "altright", "alt"],
      meta: ["metaleft", "metaright", "meta"],
      enter: ["enter", "numpadenter"],
      space: [" "],
      escape: ["escape"],
      backspace: ["backspace"],
    };
    if (key === "!") return ["1"];
    if (key === "@") return ["2"];
    if (key === "#") return ["3"];
    if (key === "$") return ["4"];
    if (key === "%") return ["5"];
    if (key === "^") return ["6"];
    if (key === "&") return ["7"];
    if (key === "*") return ["numpadmultiply", "8"];
    if (key === "(") return ["9"];
    if (key === ")") return ["0"];
    
    if (key === "controlleft" || key === "controlright") return map.ctrl!;
    if (key === "shiftleft" || key === "shiftright") return map.shift!;
    if (key === "altleft" || key === "altright") return map.alt!;
    if (key === "metaleft" || key === "metaright") return map.meta!;
    if (key === "numpaddot") return ["numpaddot", "."];



    
    return [key];
  };

  useEffect(() => {
    if (!isTesting) return;

    const down = (e: KeyboardEvent) => {
      e.preventDefault();
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();
      setPressedKeys(prev => new Set(prev).add(key).add(code));
      setInputLog(log => [key, ...log].slice(0, 30));
    };

    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const code = e.code.toLowerCase();
      setPressedKeys(prev => {
        const s = new Set(prev);
        s.delete(key);
        s.delete(code);
        return s;
      });
    };

    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [isTesting]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 p-4">
    <div className="w-full p-4 bg-white rounded-lg shadow h-32 overflow-y-auto">
    {inputLog.length === 0 ? (
    <p className="text-gray-400">按下按键将显示在这里...</p>
    ) : (
    <div className="w-full grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
      {inputLog.map((k, i) => (
        <div key={i} className="text-sm truncate">{k}</div>
      ))}
    </div>
  )}
</div>

      <div className="flex flex-col gap-1 w-full">
        {keyboardRows.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1 flex-wrap">
            {row.map((key, idx) => {
              const active = getKeyList(key).some(k => pressedKeys.has(k));
              const label = displayNames[key] ?? key;
              return (
                <div
                  key={`${rowIdx}-${idx}`}
                  className={`px-2 py-3 sm:px-3 sm:py-4 border rounded text-xs sm:text-sm font-medium transition-all
                    ${active ? "bg-blue-500 text-white border-blue-600" : "bg-gray-100"}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}