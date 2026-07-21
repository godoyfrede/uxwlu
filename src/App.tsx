/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { Layout } from "./components/Layout";
import { ReviewMode } from "./components/ReviewMode";
import { GenerateMode } from "./components/GenerateMode";
import { ExplainMode } from "./components/ExplainMode";
import { AnalyzeMode } from "./components/AnalyzeMode";
import { HistoryProvider, useHistory } from "./HistoryContext";

function AppContent() {
  const [activeMode, setActiveMode] = useState("review");
  const { activeHistoryItem, setActiveHistoryItem } = useHistory();

  useEffect(() => {
    if (activeHistoryItem) {
      if (activeHistoryItem.mode !== "normalize") {
        setActiveMode(activeHistoryItem.mode);
      }
    }
  }, [activeHistoryItem]);

  return (
    <Layout 
      activeMode={activeMode} 
      setActiveMode={(mode) => {
        setActiveMode(mode);
        setActiveHistoryItem(null);
      }}
    >
      {activeMode === "review" && <ReviewMode tone="auto" initialItem={activeHistoryItem?.mode === "review" ? activeHistoryItem : null} />}
      {activeMode === "generate" && <GenerateMode tone="auto" initialItem={activeHistoryItem?.mode === "generate" ? activeHistoryItem : null} />}
      {activeMode === "explain" && <ExplainMode initialItem={activeHistoryItem?.mode === "explain" ? activeHistoryItem : null} />}
      {activeMode === "analyze" && <AnalyzeMode initialItem={activeHistoryItem?.mode === "analyze" ? activeHistoryItem : null} />}
    </Layout>
  );
}

export default function App() {
  return (
    <HistoryProvider>
      <AppContent />
    </HistoryProvider>
  );
}
