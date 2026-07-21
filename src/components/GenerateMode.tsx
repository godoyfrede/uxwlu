import { useState, useEffect } from "react";
import { Star, Copy, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { useHistory } from "../HistoryContext";

export function GenerateMode({ tone, initialItem }: { tone: string, initialItem?: any }) {
  const [intention, setIntention] = useState("");
  const [category, setCategory] = useState("");
  const [context, setContext] = useState("");
  const [variations, setVariations] = useState(2);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const { addToHistory } = useHistory();

  useEffect(() => {
    if (initialItem) {
      setIntention(initialItem.inputData.intention || "");
      setCategory(initialItem.inputData.category || "");
      setContext(initialItem.inputData.context || "");
      setVariations(initialItem.inputData.variations || 2);
      setResult(initialItem.resultData);
    }
  }, [initialItem]);

  const handleGenerate = async () => {
    if (!intention.trim() || !category.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intention, category, context, variations, tone })
      });
      if (!res.ok) throw new Error("Erro ao gerar as variações.");
      const data = await res.json();
      setResult(data);

      addToHistory({
        mode: "generate",
        title: intention.substring(0, 50) + (intention.length > 50 ? "..." : ""),
        summary: data.variations && data.variations.length > 0 ? (data.variations[0].text.substring(0, 60) + (data.variations[0].text.length > 60 ? "..." : "")) : "",
        inputData: { intention, category, context, variations, tone },
        resultData: data
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(index);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Gerar Variações</h2>
          <p className="text-sm text-gray-600 mt-2">Crie textos novos direto no tom de voz Magalu.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">O que você precisa escrever?</label>
          <textarea
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            className="w-full h-24 p-4 border border-gray-300 rounded-xl bg-gray-50 resize-none transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Mensagem avisando que o produto está esgotado"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Categoria (obrigatório)</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Microcopy de sistema, CTA, Aviso"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Contexto (opcional)</label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Página de Produto (PDP)"
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Quantidade</label>
          <select
            value={variations}
            onChange={(e) => setVariations(Number(e.target.value))}
            className="w-full p-4 border border-gray-300 rounded-xl bg-gray-50 transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
          >
            <option value={2}>2 variações</option>
            <option value={3}>3 variações</option>
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !intention.trim() || !category.trim()}
          className="mt-2 w-full py-4 bg-magalu-blue hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Gerar"}
        </button>
      </div>

      <div className="flex-1 bg-magalu-bg rounded-2xl p-6 border border-gray-100 flex flex-col">
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <Sparkles className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-600">Preencha os campos ao lado para<br/>gerar textos incríveis.</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-magalu-blue animate-spin mb-4" />
            <div className="w-full h-24 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
            <div className="w-full h-24 bg-gray-200 rounded-xl animate-pulse"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {result && !loading && result.variations && (
          <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300 overflow-y-auto p-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {result.variations.map((v: any, i: number) => (
                <div key={i} className={`relative p-6 rounded-xl border flex flex-col h-full ${v.isRecommended ? 'bg-white border-magalu-blue ring-1 ring-magalu-blue/20 shadow-md' : 'bg-white border-gray-200'}`}>
                  
                  {v.isRecommended && (
                    <div className="mb-3 inline-flex self-start px-2.5 py-1 bg-magalu-blue text-white text-[10px] font-bold uppercase tracking-wider rounded items-center gap-1.5 shadow-sm">
                      <Star className="w-3 h-3 fill-white" /> Recomendado
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="text-gray-900 text-lg font-medium tracking-wide">
                      {v.text}
                    </div>
                  </div>

                  {v.isRecommended && v.reason && (
                    <div className="mt-4 text-sm text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <span className="font-semibold text-gray-700">Por que?</span> {v.reason}
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4 mb-4">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{v.category}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">{v.pilar}</span>
                  </div>

                  <div className="pt-3 border-t border-gray-100 mt-auto">
                    <button
                      onClick={() => {
                        handleCopy(v.text, i);
                        addToHistory({
                          mode: "generate",
                          title: "Opção escolhida",
                          summary: v.text.substring(0, 60) + (v.text.length > 60 ? "..." : ""),
                          verdict: "Conforme",
                          inputData: { intention, category, context, variations, tone },
                          resultData: { chosen: v, all: result }
                        });
                      }}
                      className="w-full py-2 bg-gray-50 hover:bg-magalu-blue hover:text-white text-gray-700 font-medium rounded-lg transition-colors flex justify-center items-center gap-2 text-sm focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
                    >
                      {copiedId === i ? <><span className="text-magalu-blue">Copiado!</span></> : <><Copy className="w-4 h-4" /> Escolher esta</>}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-600 text-center mt-2">
              Fonte: {result.variations[0]?.source}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
