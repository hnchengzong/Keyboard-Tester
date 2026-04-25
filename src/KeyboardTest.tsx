import { useState, useEffect, useCallback } from "react";

const MAX_LOG_ENTRIES = 30;

const KEYBOARD_ROWS = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
  ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
  ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "ContextMenu", "ControlRight", "ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"],
];

const DISPLAY_NAMES: Record<string, string> = {
  escape: "Esc",
  backspace: "⌫",
  tab: "Tab",
  capslock: "Caps",
  enter: "Enter",
  shiftleft: "LShift",
  shiftright: "RShift",
  controlleft: "Ctrl",
  controlright: "Ctrl",
  metaleft: "Meta",
  contextmenu: "Menu",
  space: "Space",
  arrowup: "↑",
  arrowleft: "←",
  arrowdown: "↓",
  arrowright: "→",
  minus: "-",
  equal: "=",
  backquote: "`",
  altleft: "Alt",
  altright: "Alt",
  semicolon: ";",
  quote: "'",
  comma: ",",
  period: ".",
  slash: "/",
  bracketleft: "[",
  bracketright: "]",
  backslash: "\\",
  digit0: "0",
  digit1: "1",
  digit2: "2",
  digit3: "3",
  digit4: "4",
  digit5: "5",
  digit6: "6",
  digit7: "7",
  digit8: "8",
  digit9: "9",
  f1: "F1",
  f2: "F2",
  f3: "F3",
  f4: "F4",
  f5: "F5",
  f6: "F6",
  f7: "F7",
  f8: "F8",
  f9: "F9",
  f10: "F10",
  f11: "F11",
  f12: "F12",
};

interface KeyInfo {
  key: string;
  code: string;
  timestamp: number;
}

export default function KeyboardTest({ isTesting }: { isTesting: boolean }) {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [inputLog, setInputLog] = useState<KeyInfo[]>([]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const key = e.key.toLowerCase();
    const code = e.code.toLowerCase();
    
    setPressedKeys(prev => new Set(prev).add(key).add(code));
    
    setInputLog(prev => [{
      key: e.key,
      code: e.code,
      timestamp: Date.now()
    }, ...prev].slice(0, MAX_LOG_ENTRIES));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    const code = e.code.toLowerCase();
    
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(key);
      newSet.delete(code);
      return newSet;
    });
  }, []);

  useEffect(() => {
    if (!isTesting) return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isTesting, handleKeyDown, handleKeyUp]);

  const clearLog = useCallback(() => {
    setInputLog([]);
    setPressedKeys(new Set());
  }, []);

  const getKeyDisplay = useCallback((code: string): string => {
    const normalized = code.toLowerCase();
    return DISPLAY_NAMES[normalized] || 
           normalized.replace(/^key|^digit|^arrow/, "").toUpperCase();
  }, []);

  const isKeyActive = useCallback((code: string): boolean => {
    const normalized = code.toLowerCase();
    return pressedKeys.has(normalized) || 
           pressedKeys.has(normalized.replace(/^key|^digit/, ""));
  }, [pressedKeys]);

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-6 p-4">
      <div className="w-full p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium text-gray-700">按键历史</h3>
          <button
            onClick={clearLog}
            className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            aria-label="清除历史记录"
          >
            清除
          </button>
        </div>
        <div className="h-32 overflow-y-auto">
          {inputLog.length === 0 ? (
            <p className="text-gray-400 text-sm">按下按键将显示在这里...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {inputLog.map((entry, i) => (
                <div 
                  key={`${entry.timestamp}-${i}`} 
                  className="text-xs p-2 bg-gray-50 rounded border border-gray-200"
                >
                  <div className="font-medium truncate">{entry.key}</div>
                  <div className="text-gray-500 text-[10px] truncate">{entry.code}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full" role="group" aria-label="键盘布局">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex justify-center gap-1 flex-wrap">
            {row.map((code, idx) => {
              const active = isKeyActive(code);
              const label = getKeyDisplay(code);
              return (
                <div
                  key={`${rowIdx}-${idx}`}
                  className={`px-2 py-3 sm:px-3 sm:py-4 border rounded text-xs sm:text-sm font-medium transition-all min-w-[2rem] text-center
                    ${active 
                      ? "bg-blue-500 text-white border-blue-600 shadow-md transform scale-105" 
                      : "bg-gray-100 border-gray-300 hover:border-gray-400"
                    }`}
                  aria-pressed={active}
                  title={`${code} (${label})`}
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