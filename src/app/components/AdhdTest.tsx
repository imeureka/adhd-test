"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import ResultView from "./ResultView";
import { sendEvent } from "../utils/ga";

const CONFIG = {
	TARGET_COUNT: 8,
	DISTRACTOR_COUNT: 17,
	WORD_SHOW_TIME: 500,
	RECALL_TIME: 20000,
};

const WORDS = [
	"빌런",
	"떡상",
	"짱구",
	"철컹",
	"흑역",
	"댕댕",
	"킹받",
	"몰루",
	"현타",
	"웃참",
	"핫걸",
	"쩝쩝",
	"만렙",
	"노답",
	"폭망",
	"개추",
	"찐텐",
	"꿀잼",
	"노잼",
	"급식",
	"아싸",
	"띵꼭",
	"인싸",
	"꼬북",
	"본새",
];

function shuffle<T>(arr: T[]): T[] {
	const result = [...arr];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

type Phase = "ready" | "showing" | "selecting" | "finished";

export default function AdhdTestPage() {
	const [phase, setPhase] = useState<Phase>("ready");
	const [currentWordIndex, setCurrentWordIndex] = useState(0);
	const [timeLeft, setTimeLeft] = useState(0);
	const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
	const [score, setScore] = useState(0);
	const [gameKey, setGameKey] = useState(0);

	//  페이지 진입 이벤트
	useEffect(() => {
		sendEvent("adhd_page_view", { page: "ready" });
	}, []);

	const { targetWords, allOptions } = useMemo(() => {
		const shuffled = shuffle(WORDS);
		const targets = shuffled.slice(0, CONFIG.TARGET_COUNT);
		const distractors = shuffled.slice(
			CONFIG.TARGET_COUNT,
			CONFIG.TARGET_COUNT + CONFIG.DISTRACTOR_COUNT
		);
		const options = shuffle([...targets, ...distractors]);
		return { targetWords: targets, allOptions: options };
	}, [gameKey]);

	const startGame = () => {
		sendEvent("adhd_start_click", { source: "ready_screen" }); //시작 클릭 이벤트
		setGameKey((k) => k + 1);
		setSelectedWords(new Set());
		setCurrentWordIndex(0);
		setPhase("showing");
	};

	useEffect(() => {
		if (phase !== "showing") return;
		const timer = setTimeout(() => {
			const nextIndex = currentWordIndex + 1;
			if (nextIndex >= targetWords.length) {
				setPhase("selecting");
				setTimeLeft(CONFIG.RECALL_TIME);
			} else {
				setCurrentWordIndex(nextIndex);
			}
		}, CONFIG.WORD_SHOW_TIME);
		return () => clearTimeout(timer);
	}, [phase, currentWordIndex, targetWords.length]);

	const MAX_SELECT = CONFIG.TARGET_COUNT;

	const finishGame = useCallback(() => {
		const correctCount = targetWords.filter((w) => selectedWords.has(w)).length;
		sendEvent("adhd_submit", { score: correctCount }); // ✅ 제출 이벤트
		setScore(correctCount);
		setPhase("finished");
	}, [targetWords, selectedWords]);

	useEffect(() => {
		if (phase !== "selecting" || timeLeft <= 0) return;
		const timer = setTimeout(() => setTimeLeft(timeLeft - 100), 100);
		return () => clearTimeout(timer);
	}, [phase, timeLeft]);

	useEffect(() => {
		if (phase === "selecting" && timeLeft <= 0) finishGame();
	}, [phase, timeLeft, finishGame]);

	const toggleWord = (word: string) => {
		setSelectedWords((prev) => {
			const next = new Set(prev);
			if (next.has(word)) {
				next.delete(word);
				return next;
			}
			if (next.size >= MAX_SELECT) return prev;
			next.add(word);
			return next;
		});
	};

	const formatTime = (ms: number) => {
		const s = Math.max(0, Math.ceil(ms / 1000));
		const mm = String(Math.floor(s / 60)).padStart(2, "0");
		const ss = String(s % 60).padStart(2, "0");
		return `${mm}:${ss}`;
	};

	return (
		<div className="flex flex-row justify-center w-full min-h-dvh bg-gray-50">
			<div className="relative w-full max-w-md mx-auto flex flex-col px-8 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
				<main className="flex-1 flex flex-col">
					{phase === "ready" && (
						<section className="flex-1 flex flex-col items-center justify-center text-center gap-8">
							<div>
								<h1 className="text-h2 tracking-tight">
									ADHD 단어 기억 테스트!
								</h1>
								<p className="mt-2 text-base text-muted-foreground">
									총 {CONFIG.TARGET_COUNT}개의 단어를 기억해보세요
								</p>
							</div>
							<Image
								src="/meonjiTest.svg"
								alt="먼지치우기"
								width={240}
								height={240}
								className="w-60 h-60"
							/>
							<button
								onClick={startGame}
								className="w-full bg-yellow-100 text-gray-900 py-4 rounded-xl text-lg font-medium shadow-sm hover:bg-yellow-200 transition"
							>
								시작하기
							</button>
						</section>
					)}

					{phase === "showing" && (
						<section className="flex-1 flex items-center justify-center text-center">
							<div className="w-[314px] h-[130px] bg-white shadow-sm flex flex-col items-center justify-center pt-[13px] pb-[20px] gap-[13px]">
								<div className="text-3xl font-extrabold">
									{targetWords[currentWordIndex]}
								</div>
								<div className="text-sm text-gray-400 font-medium">
									{currentWordIndex + 1}/{targetWords.length}
								</div>
							</div>
						</section>
					)}

					{phase === "selecting" && (
						<section className="flex-1 flex flex-col items-center justify-center text-center gap-6">
							<p className="text-base font-medium">기억한 단어를 선택하세요!</p>
							<div className="text-h1 font-extrabold">
								{formatTime(timeLeft)}
							</div>

							<div className="grid grid-cols-[repeat(5,51px)] gap-x-[15px] gap-y-[15px] justify-center">
								{allOptions.map((word) => {
									const active = selectedWords.has(word);
									const disabled = selectedWords.size >= MAX_SELECT && !active;
									return (
										<button
											key={word}
											onClick={() => toggleWord(word)}
											aria-pressed={active}
											disabled={disabled}
											className={[
												"w-[51px] h-[71px] rounded-[3px] flex items-center justify-center transition",
												disabled ? "opacity-40 cursor-not-allowed" : "",
												active
													? "bg-yellow100 border border-yellowBorder"
													: "bg-white text-gray-900 shadow-sm",
											].join(" ")}
										>
											<span className="text-[16px] font-semibold leading-none">
												{word}
											</span>
										</button>
									);
								})}
							</div>

							<p className="mt-2 text-sm">
								선택한 단어 :
								<b
									className={
										selectedWords.size >= MAX_SELECT
											? "text-red-600 ml-1"
											: "text-gray-700 ml-1"
									}
								>
									{selectedWords.size}/{MAX_SELECT}개
								</b>
							</p>
						</section>
					)}

					{phase === "finished" && (
						<section className="flex-1 flex items-center justify-center">
							<ResultView
								score={score}
								max={targetWords.length}
								targets={targetWords}
							/>
						</section>
					)}
				</main>

				{phase === "selecting" && (
					<footer className="sticky bottom-0 left-0 right-0 z-10 bg-gray-50/80 backdrop-blur -mx-4 px-4 pt-3 pb-4">
						<button
							onClick={finishGame}
							className="h-[50px] w-full rounded-[7px] bg-yellow100 font-medium shadow-sm hover:bg-yellowBorder transition"
						>
							제출하기
						</button>
					</footer>
				)}
			</div>
		</div>
	);
}
