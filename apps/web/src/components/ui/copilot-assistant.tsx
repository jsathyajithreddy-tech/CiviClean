import { AnimatePresence, motion } from "framer-motion";
import { Bot, Mic, Send, Volume2, X } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useCopilotQuery } from "../../features/enterprise/use-enterprise-operations";
import { usePlatform } from "../../features/platform/platform-context";
import { CopilotResponse } from "../../services/enterprise-api";
import { Sparkline, StatusBadge } from "./enterprise-widgets";

interface CopilotMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  response?: CopilotResponse;
}

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function readMarkdown(markdown: string): string[] {
  return markdown
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function CopilotAssistant(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("Summarize city status.");
  const [messages, setMessages] = useState<CopilotMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const { pushToast, triggerQuickAction } = usePlatform();
  const copilot = useCopilotQuery();

  const suggestedPrompts = useMemo(
    () =>
      copilot.data?.suggested_prompts ?? [
        "Why is traffic increasing?",
        "Show all critical incidents.",
        "Predict congestion in the next hour.",
      ],
    [copilot.data],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!question.trim()) {
      return;
    }
    const currentQuestion = question.trim();
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: currentQuestion },
    ]);
    const result = await copilot.mutateAsync(currentQuestion);
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        text: result.answer,
        response: result,
      },
    ]);
    pushToast("Copilot updated", `Answered with ${(result.confidence_score * 100).toFixed(0)}% confidence.`);
  };

  const startVoiceInput = () => {
    const SpeechRecognitionCtor =
      (window as Window & {
        SpeechRecognition?: new () => SpeechRecognitionLike;
        webkitSpeechRecognition?: new () => SpeechRecognitionLike;
      }).SpeechRecognition ??
      (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      pushToast("Voice input unavailable", "Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript ?? "")
        .join(" ");
      setQuestion(transcript.trim());
      setIsListening(false);
      recognition.stop();
    };
    recognition.onerror = () => {
      setIsListening(false);
      recognition.stop();
      pushToast("Voice input error", "Unable to capture the spoken command. Please try again.");
    };
    setIsListening(true);
    recognition.start();
  };

  const speakAnswer = (response: CopilotResponse) => {
    if (!("speechSynthesis" in window)) {
      pushToast("Voice output unavailable", "Speech synthesis is not supported in this browser.");
      return;
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(response.answer));
  };

  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <>
      <div className="fixed bottom-6 left-6 z-30">
        <button
          aria-label="Open AI copilot"
          className="flex items-center gap-3 rounded-full border border-accent-400/30 bg-accent-500/15 px-5 py-3 text-sm text-primary shadow-glow backdrop-blur-xl transition hover:bg-accent-500/25"
          onClick={() => setIsOpen(true)}
          type="button"
        >
          <Bot className="h-4 w-4 text-accent-300" />
          AI Copilot
        </button>
      </div>
      <AnimatePresence>
        {isOpen ? (
          <motion.aside
            animate={{ opacity: 1, y: 0 }}
            className="fixed bottom-24 left-6 z-40 h-[min(82vh,760px)] w-[min(480px,calc(100vw-2rem))] rounded-[32px] border border-white/10 bg-panel p-5 shadow-glow backdrop-blur-xl"
            exit={{ opacity: 0, y: 14 }}
            initial={{ opacity: 0, y: 14 }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-primary">Enterprise AI Copilot</p>
                  <p className="mt-1 text-sm text-muted">Operational Q&A, explainability, and command actions</p>
                </div>
                <button
                  className="rounded-full border border-white/10 p-2 text-muted transition hover:text-primary"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                    onClick={() => setQuestion(prompt)}
                    type="button"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
                {messages.length === 0 ? (
                  <div className="rounded-2xl border border-white/8 bg-white/5 p-4 text-sm text-muted">
                    Ask about incidents, forecasts, emergency dispatch, or explainable AI decisions.
                  </div>
                ) : (
                  messages.map((message) => {
                    const response = message.response;
                    return (
                      <div
                        key={message.id}
                        className={[
                          "rounded-2xl border p-4",
                          message.role === "user"
                            ? "border-accent-400/20 bg-accent-500/10"
                            : "border-white/8 bg-white/5",
                        ].join(" ")}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-primary">
                            {message.role === "user" ? "Operator" : "Copilot"}
                          </p>
                          {response ? (
                            <StatusBadge
                              label={`${(response.confidence_score * 100).toFixed(0)}% confidence`}
                              tone="success"
                            />
                          ) : null}
                        </div>
                        {response ? (
                        <div className="mt-3 space-y-3">
                          {readMarkdown(response.markdown_answer).map((line) => (
                            <p key={line} className="text-sm leading-6 text-muted">
                              {line}
                            </p>
                          ))}
                          {response.chart ? (
                            <div className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm text-primary">{response.chart.title}</p>
                                <p className="text-xs uppercase tracking-[0.18em] text-muted">
                                  {response.chart.unit}
                                </p>
                              </div>
                              <Sparkline
                                points={response.chart.points.map((point) => point.value)}
                                tone="accent"
                              />
                              <div className="grid gap-2 md:grid-cols-3">
                                {response.chart.points.map((point) => (
                                  <div key={point.label} className="rounded-xl border border-white/8 bg-white/5 p-3 text-sm text-muted">
                                    <p className="text-primary">{point.label}</p>
                                    <p className="mt-1">
                                      {point.value}
                                      {response.chart ? response.chart.unit : ""}
                                    </p>
                                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-muted">
                                      {point.lower_bound} to {point.upper_bound}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : null}
                          <div className="flex flex-wrap gap-2">
                            {response.sources.map((source) => (
                              <StatusBadge
                                key={`${source.kind}-${source.label}`}
                                label={`${source.label} • ${source.freshness}`}
                                tone="accent"
                              />
                            ))}
                          </div>
                          <div className="rounded-xl border border-white/8 bg-surface-900/50 p-3">
                            <p className="text-sm text-primary">Reasoning</p>
                            <div className="mt-2 space-y-2">
                              {response.reasoning.map((item) => (
                                <p key={item} className="text-sm text-muted">
                                  {item}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {response.cited_domains.map((domain) => (
                              <StatusBadge key={domain} label={domain} tone="success" />
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-white/5"
                              onClick={() => speakAnswer(response)}
                              type="button"
                            >
                              <Volume2 className="h-4 w-4" />
                              Speak
                            </button>
                            {response.suggested_actions.map((action) => (
                              <button
                                key={action}
                                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-accent-500/10"
                                onClick={() => triggerQuickAction(action)}
                                type="button"
                              >
                                {action}
                              </button>
                            ))}
                          </div>
                        </div>
                        ) : (
                          <p className="mt-3 text-sm leading-6 text-muted">{message.text}</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <textarea
                    aria-label="Copilot question"
                    className="h-24 w-full resize-none border-0 bg-transparent text-sm text-primary outline-none placeholder:text-muted"
                    onChange={(event) => setQuestion(event.target.value)}
                    placeholder="Ask about incidents, forecasts, water leaks, traffic, AQI, or reports"
                    value={question}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    className="flex items-center gap-2 rounded-full border border-accent-400/25 bg-accent-500/10 px-4 py-2 text-sm text-primary transition hover:bg-accent-500/20"
                    disabled={copilot.isPending}
                    type="submit"
                  >
                    <Send className="h-4 w-4" />
                    {copilot.isPending ? "Thinking..." : "Ask Copilot"}
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-primary transition hover:border-accent-400/25 hover:bg-white/5"
                    onClick={startVoiceInput}
                    type="button"
                  >
                    <Mic className="h-4 w-4" />
                    {isListening ? "Listening..." : "Voice input"}
                  </button>
                </div>
              </form>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>
    </>
  );
}
