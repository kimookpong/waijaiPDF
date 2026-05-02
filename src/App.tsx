import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import SettingsModal from "./components/SettingsModal";
import HomeScreen from "./screens/HomeScreen";
import AnalyzingScreen from "./screens/AnalyzingScreen";
import AnalysisScreen from "./screens/AnalysisScreen";
import CompressScreen from "./screens/CompressScreen";
import ConvertScreen from "./screens/ConvertScreen";
import ProcessingScreen from "./screens/ProcessingScreen";
import DownloadScreen from "./screens/DownloadScreen";
import type {
  Screen,
  ActionId,
  Analysis,
  ProcessOptions,
  ProcessResult,
  TweakValues,
} from "./types";

const DEFAULTS: TweakValues = {
  accentColor: "#7a0006",
  brandName: "waijaiPDF",
};

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <div
      style={{
        position: "fixed",
        top: 64,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 300,
        maxWidth: 480,
        width: "calc(100% - 32px)",
        background: "#fff0f0",
        border: "1px solid #f5c6c6",
        borderRadius: "var(--r)",
        padding: "12px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        boxShadow: "var(--shadow-md)",
        animation: "fadeUp .2s ease both",
      }}
    >
      <span style={{ fontSize: 13, color: "#a00", flex: 1, lineHeight: 1.5 }}>
        ⚠️ {message}
      </span>
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#a00",
          fontSize: 16,
          lineHeight: 1,
          padding: 2,
        }}
      >
        ✕
      </button>
    </div>
  );
}

export default function App() {
  const [t] = useState<TweakValues>(DEFAULTS);
  const [screen, setScreen] = useState<Screen>("home");
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [action, setAction] = useState<ActionId | null>(null);
  const [options, setOptions] = useState<ProcessOptions | null>(null);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accentColor);
  }, [t.accentColor]);

  const handleFile = (f: File) => {
    if (
      !f.name.toLowerCase().endsWith(".pdf") &&
      f.type !== "application/pdf"
    ) {
      setError("กรุณาอัปโหลดไฟล์ PDF เท่านั้น");
      return;
    }
    if (f.size > 100 * 1024 * 1024) {
      setError("ไฟล์ขนาดใหญ่เกิน 100 MB");
      return;
    }
    setFile(f);
    setScreen("analyzing");
  };

  const handleAnalyzed = (data: Analysis) => {
    setAnalysis(data);
    setScreen("analyzed");
  };
  const handlePick = (id: ActionId) => {
    setAction(id);
    setScreen(id);
  };
  const handleSubmit = (opts: ProcessOptions) => {
    setOptions(opts);
    setScreen("processing");
  };
  const handleDone = (res: ProcessResult) => {
    setResult(res);
    setScreen("done");
  };
  const handleError = (msg: string) => {
    setError(msg);
    setScreen(analysis ? "analyzed" : "home");
  };
  const handleReset = () => {
    setFile(null);
    setAnalysis(null);
    setAction(null);
    setOptions(null);
    setResult(null);
    setScreen("home");
  };

  const showBack = !["home", "analyzing", "done"].includes(screen);
  const showNav = screen !== "analyzing";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {showNav && (
        <Nav
          t={t}
          onHome={handleReset}
          onSettings={() => setShowSettings(true)}
          showBack={showBack}
        />
      )}

      {error && (
        <ErrorBanner message={error} onDismiss={() => setError(null)} />
      )}

      <div style={{ paddingTop: showNav ? 56 : 0 }}>
        {screen === "home" && <HomeScreen t={t} onFile={handleFile} />}
        {screen === "analyzing" && file && (
          <AnalyzingScreen
            file={file}
            onDone={handleAnalyzed}
            onError={handleError}
          />
        )}
        {screen === "analyzed" && file && analysis && (
          <AnalysisScreen
            t={t}
            file={file}
            analysis={analysis}
            onPick={handlePick}
            onReset={handleReset}
          />
        )}
        {screen === "compress" && file && (
          <CompressScreen
            t={t}
            file={file}
            onSubmit={handleSubmit}
            onBack={() => setScreen("analyzed")}
          />
        )}
        {screen === "convert" && file && analysis && (
          <ConvertScreen
            t={t}
            file={file}
            analysis={analysis}
            onSubmit={handleSubmit}
            onBack={() => setScreen("analyzed")}
          />
        )}
        {screen === "processing" && file && action && options && (
          <ProcessingScreen
            t={t}
            file={file}
            action={action}
            options={options}
            onDone={handleDone}
            onError={handleError}
          />
        )}
        {screen === "done" && file && action && result && (
          <DownloadScreen
            t={t}
            file={file}
            result={result}
            action={action}
            onReset={handleReset}
          />
        )}
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
