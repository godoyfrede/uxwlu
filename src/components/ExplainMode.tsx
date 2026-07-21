import { useState, useEffect } from "react";
import { MessageCircleQuestion, AlertCircle, Loader2, BookOpen, Check, X } from "lucide-react";
import { useHistory } from "../HistoryContext";

const SUGGESTIONS = [
  "Por que 'Pix' não é 'PIX'?",
  "Como escrevo 'Frete grátis'?",
  "Quando uso 'Para todo mundo' vs 'Sempre em movimento'?",
  "Qual a regra de capitalização para botões?"
];

export function ExplainMode({ initialItem }: { initialItem?: any }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const { addToHistory } = useHistory();

  useEffect(() => {
    if (initialItem) {
      setQuestion(initialItem.inputData.question || "");
      setResult(initialItem.resultData);
    }
  }, [initialItem]);

  const handleExplain = async (q = question) => {
    if (!q.trim()) return;
    setQuestion(q);
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q })
      });
      if (!res.ok) throw new Error("Erro ao buscar a explicação.");
      const data = await res.json();
      setResult(data);

      addToHistory({
        mode: "explain",
        title: q.substring(0, 50) + (q.length > 50 ? "..." : ""),
        summary: data.answer ? (data.answer.substring(0, 60) + (data.answer.length > 60 ? "..." : "")) : "",
        inputData: { question: q },
        resultData: data
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-full">
      <div className="flex-1 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Explicar a Regra</h2>
          <p className="text-sm text-gray-600 mt-2">Tire dúvidas sobre padronização e regras de escrita.</p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-sm font-medium text-gray-700">Qual a sua dúvida?</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full h-24 p-4 border border-gray-300 rounded-xl bg-gray-50 resize-none transition-all text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            placeholder="Ex: Por que escrevemos 'Pix' e não 'PIX'?"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => handleExplain(s)}
              className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-medium rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
            >
              {s}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleExplain()}
          disabled={loading || !question.trim()}
          className="mt-2 w-full py-4 bg-magalu-blue hover:bg-blue-600 disabled:opacity-50 text-white font-medium rounded-xl transition-colors flex justify-center items-center gap-2 focus:outline-none focus:ring-2 focus:ring-magalu-blue focus:ring-offset-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Explicar"}
        </button>
      </div>

      <div className="flex-1 bg-magalu-bg rounded-2xl p-6 border border-gray-100 flex flex-col">
        {!result && !loading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50">
            <MessageCircleQuestion className="w-12 h-12 mb-4 text-gray-600" />
            <p className="text-sm font-medium text-gray-600">Pergunte algo e a Lu Writer<br/>te explica a regra certinha.</p>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-magalu-blue animate-spin mb-4" />
            <div className="w-full h-32 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-800 rounded-xl border border-red-100 flex items-start gap-4">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-magalu-blue/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-magalu-blue" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">A explicação da Lu</h3>
              </div>
              <p className="text-gray-700 text-base leading-relaxed bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                {result.answer}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2">A Regra</h4>
              <p className="text-sm text-gray-600 font-medium">
                {result.rule} {result.pilar && <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 rounded-full">{result.pilar}</span>}
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 bg-green-50 border border-green-100 p-4 rounded-xl flex items-start gap-2">
                <Check className="w-4 h-4 text-magalu-blue shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-green-800 mb-2 uppercase tracking-wider">Recomendado</div>
                  <div className="text-sm font-medium text-green-900">{result.exampleGood}</div>
                </div>
              </div>
              
              <div className="flex-1 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-2">
                <X className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-red-800 mb-2 uppercase tracking-wider">Não recomendado</div>
                  <div className="text-sm font-medium text-red-900">{result.exampleBad}</div>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 border-t border-gray-100 pt-3">
              Fonte: {result.source}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
