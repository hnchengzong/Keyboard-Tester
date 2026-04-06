import { useState } from "react"
import { Button } from "@/components/ui/button"

import KeyboardTest from "./KeyboardTest";

import "./index.css";
export function App() {
      const [isTesting, setIsTesting] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-10 px-4">
      {/* 标题 */}
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Keyboard Tester</h1>

      <div className="flex gap-4 mb-8">
        <Button
          variant={isTesting ? "destructive" : "default"}
          size="lg"
          onClick={() => setIsTesting(!isTesting)}
          className="w-36"
        >
          {isTesting ? "停止测试" : "开始测试"}
        </Button>

      </div>

      {/* 下方：单独的键盘测试组件 */}
      <KeyboardTest isTesting={isTesting} />
    </div>
    
  );
}

export default App;
