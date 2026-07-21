import { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Copy, AlertCircle, Loader2 } from "lucide-react";
import { useHistory } from "../HistoryContext";

export function ReviewMode({ tone, initialItem }: { tone: string, initialItem?: any }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (initialItem) {
      setText(initialItem.inputData.text || "");
      setCategory(initialItem.inputData.category || "");
      setContext(initialItem.inputData.context || "");
      setResult(initialItem.resultData);
    }
  }, [initialItem]);

  const handleReview = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, category, context, tone })
      });
      if (!res.ok) throw new Error("Erro ao analisar o texto.");
      const data = await res.json();
      setResult(data);
      
      addToHistory({
        mode: "review",
        title: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
        summary: data.suggestion ? (data.suggestion.substring(0, 60) + (data.suggestion.length > 60 ? "..." : "")) : data.ruleSource?.substring(0, 60),
        verdict: data.verdict,
        inputData: { text, category, context, tone },
        resultData: data
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.suggestion) {
      navigator.clipboard.writeText(result.suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Revisar e Validar</h2>
          <p className="text-sm text-gray-600 mt-2">Valide se a sua copy segue as regras do Magalu.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Cole o texto para revisar</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-32 p-4 border border-gray-300 rounded-xl bg-gray-50 resize-none transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: 10X DE R$ 177,67 SEM JUROS"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Categoria (opcional)</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Preço, Tag, Botão, etc."
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Contexto (opcional)</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Tela de carrinho de compras"
          />
        </div>

        <button
          onClick={handleReview}
          disabled={loading || !text.trim()}
          className="mt-2 w-full py-4 bg-magalu-blue hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Revisar"}
        </button>
      </div>

      <div className="flex-1 bg-magalu-bg rounded-2xl p-6 border border-gray-100 flex flex-col">
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <CheckCircle2 className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-600">Cola um texto e a Lu Writer te ajuda<br/>a deixar no tom certo.</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-magalu-blue animate-spin mb-4" />
            <div className="w-48 h-4 bg-gray-200 rounded-full animate-pulse mb-2"></div>
            <div className="w-32 h-4 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-wrap items-center gap-2">
              {result.verdict.toLowerCase().includes("conforme") && !result.verdict.toLowerCase().includes("não") ? (
                <span className="flex items-center gap-2.5 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> {result.verdict}
                </span>
              ) : result.verdict.toLowerCase().includes("ajustar") ? (
                <span className="flex items-center gap-2.5 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold">
                  <AlertTriangle className="w-4 h-4" /> {result.verdict}
                </span>
              ) : (
                <span className="flex items-center gap-2.5 px-4 py-2 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                  <XCircle className="w-4 h-4" /> {result.verdict}
                </span>
              )}
              
              <span className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium">
                {result.category}
              </span>
              <span className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-xs font-medium" title={result.source}>
                Pilar: {result.pilar}
              </span>
            </div>

            {result.isCritical && (
              <div className="p-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-sm flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Copy crítica:</strong> recomende revisão humana antes de publicar.</p>
              </div>
            )}

            {result.problems && result.problems.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">O que notamos</h3>
                <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
                  {result.problems.map((p: string, i: number) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Sugestão</h3>
              <div className="relative group">
                <div className="p-4 bg-white border border-magalu-blue/20 rounded-xl shadow-sm text-gray-900 text-base">
                  {result.suggestion}
                </div>
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
                >
                  {copied ? <span className="text-magalu-blue">Copiado!</span> : <><Copy className="w-4 h-4" /> Copiar</>}
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">Por que?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{result.justification}</p>
              <p className="text-xs text-gray-600 mt-2">Fonte: {result.source}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
