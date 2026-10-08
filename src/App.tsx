import { useMemo, useState } from "react";
import { questions, answerLabels, type Answer, type Question } from "./data/voices";

export default function App() {
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [submitted, setSubmitted] = useState(false);

  const choose = (id: number, ans: Answer) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: ans }));
  };

  const submit = () => setSubmitted(true);
  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const stats = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    questions.forEach((q) => {
      const a = answers[q.id];
      if (a === undefined) return;
      if (a === q.correct) correct++;
      else wrong++;
    });
    return { correct, wrong };
  }, [answers]);

  const percent = Math.round((stats.correct / Math.max(1, questions.length)) * 100);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Шапка */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Урок літератури · 10 клас
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            Тарас Шевченко. «Світе тихий, краю милий, моя Україно…»
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Тест на розуміння поезії: <strong>20 питань</strong>. Для кожного обери
            один варіант — <strong>Так</strong> або <strong>Ні</strong>. Після
            завершення з'являться правильні відповіді з поясненнями.
          </p>
        </div>
      </header>

      {/* Прогрес-бар */}
      <div className="mx-auto max-w-3xl px-6 pt-6">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span>
            Прогрес: {answeredCount} / {questions.length}
          </span>
          <span>
            {submitted ? "Тест завершено" : "Обери відповіді до всіх питань"}
          </span>
        </div>
        <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-slate-800 transition-all duration-500"
            style={{
              width: `${(answeredCount / Math.max(1, questions.length)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Список питань */}
      <main className="mx-auto max-w-3xl px-6 py-6">
        <ol className="space-y-4">
          {questions.map((q, i) => (
            <QuestionItem
              key={q.id}
              q={q}
              index={i}
              answer={answers[q.id]}
              onChoose={(a) => choose(q.id, a)}
              submitted={submitted}
            />
          ))}
        </ol>

        {/* Кнопки */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-200 bg-white p-4">
          <div className="text-sm text-slate-600">
            {submitted
              ? `Правильних: ${stats.correct} з ${questions.length}`
              : allAnswered
              ? "Усі питання відповіджені — можна перевірити"
              : `Залишилось ${questions.length - answeredCount} пит.`}
          </div>
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-500 hover:bg-slate-50"
            >
              Скинути
            </button>
            <button
              onClick={submit}
              disabled={!allAnswered}
              className="rounded-md bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Перевірити
            </button>
          </div>
        </div>

        {/* Підсумок */}
        {submitted && (
          <section className="mt-6 rounded-md border-2 border-slate-900 bg-white p-6">
            <h2 className="text-lg font-semibold text-slate-900">Підсумок тесту</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat label="Питань" value={String(questions.length)} />
              <Stat label="Правильних" value={String(stats.correct)} accent="emerald" />
              <Stat label="Неправильних" value={String(stats.wrong)} accent="rose" />
            </div>
            <div className="mt-5 rounded-md bg-slate-900 px-5 py-4 text-center text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300">
                Правильних відповідей
              </p>
              <p className="mt-1 text-3xl font-bold">
                {stats.correct} / {questions.length}
              </p>
              <p className="mt-1 text-sm text-slate-200">{percent}%</p>
            </div>
          </section>
        )}
      </main>

      <footer className="mx-auto max-w-3xl px-6 pb-10 pt-4 text-center text-xs text-slate-500">
        Тест укладено за мотивами поезії Т. Г. Шевченка «Світе тихий, краю милий…»
      </footer>
    </div>
  );
}

/* ------------------------ Окреме питання ------------------------ */

function QuestionItem({
  q,
  index,
  answer,
  onChoose,
  submitted,
}: {
  q: Question;
  index: number;
  answer: Answer | undefined;
  onChoose: (a: Answer) => void;
  submitted: boolean;
}) {
  const options: Answer[] = ["yes", "no"];
  const isCorrect = submitted && answer === q.correct;
  const isWrong = submitted && answer !== undefined && answer !== q.correct;

  return (
    <li
      className={`rounded-md border bg-white p-4 transition ${
        submitted && isCorrect
          ? "border-emerald-400 bg-emerald-50/50"
          : submitted && isWrong
          ? "border-rose-400 bg-rose-50/50"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-sm font-semibold text-slate-700">
          {index + 1}
        </span>
        <div className="flex-1">
          <p className="text-base text-slate-900">{q.question}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {options.map((opt) => {
              const selected = answer === opt;
              const isThisCorrect = submitted && q.correct === opt;
              const isThisWrong = submitted && selected && q.correct !== opt;

              return (
                <button
                  key={opt}
                  onClick={() => onChoose(opt)}
                  disabled={submitted}
                  className={`rounded-md border px-3 py-1.5 text-sm transition ${
                    isThisCorrect
                      ? "border-emerald-500 bg-emerald-100 text-emerald-900"
                      : isThisWrong
                      ? "border-rose-400 bg-rose-100 text-rose-900 line-through"
                      : selected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-700 hover:border-slate-500 hover:bg-slate-50"
                  } disabled:cursor-not-allowed`}
                >
                  {answerLabels[opt]}
                </button>
              );
            })}
          </div>

          {submitted && (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-sm">
              <p className="text-xs uppercase tracking-wider text-slate-500">
                Правильна відповідь:{" "}
                <span className="font-semibold text-slate-900">
                  {answerLabels[q.correct]}
                </span>
              </p>
              <p className="mt-1 text-slate-700 leading-relaxed">{q.explanation}</p>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

function Stat({
  label,
  value,
  accent = "slate",
}: {
  label: string;
  value: string;
  accent?: "slate" | "emerald" | "rose";
}) {
  const tones: Record<string, string> = {
    slate: "border-slate-200 bg-slate-50 text-slate-900",
    emerald: "border-emerald-300 bg-emerald-50 text-emerald-900",
    rose: "border-rose-300 bg-rose-50 text-rose-900",
  };
  return (
    <div className={`rounded-md border p-3 text-center ${tones[accent]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-0.5 text-[11px] uppercase tracking-wider opacity-70">
        {label}
      </div>
    </div>
  );
}