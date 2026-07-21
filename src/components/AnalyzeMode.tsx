import React, { useState, useRef, Fragment, useEffect } from "react";
import { ImageIcon, UploadCloud, AlertCircle, Loader2, CheckCircle2, AlertTriangle, XCircle, X, Copy } from "lucide-react";
import { useHistory } from "../HistoryContext";

function LoadingProgress() {
  const [progress, setProgress] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = [
    "Iniciando análise...",
    "Lendo os textos da interface...",
    "Verificando a capitalização...",
    "Analisando o tom de voz Magalu...",
    "Preparando as sugestões..."
  ];

  useEffect(() => {
    const totalDuration = 10000; // estimated time 10s
    const updateInterval = 100;
    const steps = totalDuration / updateInterval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const newProgress = Math.min(95, (currentStep / steps) * 100);
      setProgress(newProgress);

      const phraseCount = phrases.length;
      const index = Math.floor((newProgress / 100) * phraseCount);
      setPhraseIndex(Math.min(phraseCount - 1, index));
    }, updateInterval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto h-full space-y-6">
      <div className="text-lg font-medium text-gray-800 animate-pulse text-center">
        {phrases[phraseIndex]}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-magalu-blue transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function AnalyzeMode({ initialItem }: { initialItem?: any }) {
  const [context, setContext] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (initialItem) {
      setContext(initialItem.inputData.context || "");
      setImagePreview(initialItem.inputData.imagePreview || null);
      setResult(initialItem.resultData);
    }
  }, [initialItem]);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
              setImagePreview(event.target?.result as string);
              setResult(null);
              setError("");
            };
            reader.readAsDataURL(file);
            break; // take the first image
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, envie uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setResult(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Por favor, envie uma imagem válida.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
      setResult(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Increase body size limit if needed in real app, express is configured for 50mb
        body: JSON.stringify({ image: imagePreview, context })
      });
      if (!res.ok) throw new Error("Erro ao analisar a imagem.");
      const data = await res.json();
      setResult(data);

      let adjustCount = 0;
      let badCount = 0;
      if (data.findings) {
        data.findings.forEach((f: any) => {
          const s = f.status.toLowerCase();
          if (s.includes("ajustar")) adjustCount++;
          else if (s.includes("não")) badCount++;
        });
      }

      addToHistory({
        mode: "analyze",
        title: context.substring(0, 50) + (context.length > 50 ? "..." : ""),
        summary: data.findings ? `${data.findings.length} textos encontrados (${adjustCount + badCount} precisando de ajuste)` : "",
        inputData: { context, imagePreview },
        resultData: data
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderStatus = (status: string) => {
    if (status.toLowerCase().includes("conforme") && !status.toLowerCase().includes("não")) {
      return <span className="inline-flex items-center gap-2 text-green-800 bg-green-100 px-2 py-0.5 rounded text-xs font-semibold"><CheckCircle2 className="w-3 h-3" /> Conforme</span>;
    }
    if (status.toLowerCase().includes("ajustar")) {
      return <span className="inline-flex items-center gap-2 text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-xs font-semibold"><AlertTriangle className="w-3 h-3" /> Ajustar</span>;
    }
    return <span className="inline-flex items-center gap-2 text-red-800 bg-red-100 px-2 py-0.5 rounded text-xs font-semibold"><XCircle className="w-3 h-3" /> Não conforme</span>;
  };

  const getSummary = () => {
    if (!result?.findings) return null;
    let ok = 0;
    let adjust = 0;
    let bad = 0;
    result.findings.forEach((f: any) => {
      const s = f.status.toLowerCase();
      if (s.includes("conforme") && !s.includes("não")) ok++;
      else if (s.includes("ajustar")) adjust++;
      else bad++;
    });
    return { ok, adjust, bad };
  };

  const summary = getSummary();

  const groupedFindings = result?.findings ? result.findings.reduce((acc: any, curr: any, index: number) => {
    const region = curr.region || "Outros";
    if (!acc[region]) acc[region] = [];
    acc[region].push({ ...curr, globalIndex: index });
    return acc;
  }, {}) : {};

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Analisar Tela</h2>
          <p className="text-sm text-gray-600 mt-2">Envie um print e a Lu Writer analisa os textos e capitalização.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Que tela é esta? (obrigatório)</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: PDP de celular, Carrinho, Listagem..."
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Upload do Print</label>
          
          {!imagePreview ? (
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="h-48 border-2 border-dashed border-gray-300 hover:border-magalu-blue rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer transition-colors group"
              >
                <UploadCloud className="w-8 h-8 text-gray-600 group-hover:text-magalu-blue mb-2 transition-colors" />
                <p className="text-sm font-medium text-gray-600">Arraste, clique ou cole (Ctrl+V) para enviar</p>
                <p className="text-xs text-gray-600 mt-2">PNG, JPG</p>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2" 
                />
              </div>
          ) : (
            <div className="h-48 relative rounded-xl border border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
              <button 
                onClick={removeImage}
                className="absolute top-2 right-2 p-2.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !imagePreview || !context.trim()}
          className="mt-auto w-full py-4 bg-magalu-blue hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analisar tela"}
        </button>
      </div>

      <div className="flex-[1.5] bg-magalu-bg rounded-2xl p-6 border border-gray-100 flex flex-col">
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <ImageIcon className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-600">Envie a imagem e veja os achados<br/>aqui nesta área.</p>
          </div>
        )}

        {loading && (
          <LoadingProgress />
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {result && !loading && result.findings && (
          <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Achados na tela</h3>
              {summary && (
                <div className="flex items-center gap-2 text-xs font-medium">
                  <span className="bg-green-100 text-green-800 px-2 py-2 rounded-md">{summary.ok} conformes</span>
                  <span className="bg-amber-100 text-amber-800 px-2 py-2 rounded-md">{summary.adjust} para ajustar</span>
                  <span className="bg-red-100 text-red-800 px-2 py-2 rounded-md">{summary.bad} não conformes</span>
                </div>
              )}
            </div>

            {result.readabilityWarning && (
              <div className="mb-4 p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Baixa legibilidade:</strong> O print está difícil de ler. Considere enviar uma imagem com melhor qualidade ou recortada para uma análise mais precisa.</p>
              </div>
            )}
            
            <div className="flex-1 overflow-auto rounded-xl border border-gray-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-600 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-4">Texto na tela</th>
                    <th className="px-4 py-4">Categoria</th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4">Sugestão & Regra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {Object.entries(groupedFindings).map(([region, items]: [string, any]) => (
                    <Fragment key={region}>
                      <tr>
                        <td colSpan={4} className="bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600 uppercase tracking-wider">
                          {region}
                        </td>
                      </tr>
                      {items.map((f: any) => (
                        <tr key={f.globalIndex} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-4 font-medium text-gray-900 w-1/3">{f.text}</td>
                          <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{f.category}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {renderStatus(f.status)}
                          </td>
                          <td className="px-4 py-4">
                            {f.suggestion && (
                              <div className="mb-2 text-gray-900 font-medium flex items-center justify-between bg-magalu-blue/5 p-2 rounded-lg border border-magalu-blue/10">
                                <span>{f.suggestion}</span>
                                {(!f.status.toLowerCase().includes("conforme") || f.status.toLowerCase().includes("não") || f.status.toLowerCase().includes("ajustar")) && (
                                  <button
                                    onClick={() => handleCopy(f.suggestion, f.globalIndex)}
                                    className="shrink-0 p-2.5 text-gray-600 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors flex items-center gap-2 text-xs focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
                                  >
                                    {copiedId === f.globalIndex ? <span className="text-magalu-blue font-medium">Copiado</span> : <><Copy className="w-3 h-3" /> Copiar</>}
                                  </button>
                                )}
                              </div>
                            )}
                            <div className="text-xs text-gray-600">{f.ruleSource}</div>
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  ))}
                </tbody>
              </table>
              {result.findings.length === 0 && (
                <div className="p-8 text-center text-gray-600">Nenhum texto relevante encontrado ou analisável.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
