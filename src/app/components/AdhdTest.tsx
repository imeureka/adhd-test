"use client";

import { useEffect, useMemo, useState } from "react";
import ResultView from "./ResultView";

// 설정값들
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

	// 게임할 때마다 새로운 단어들 생성
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

	// 게임 시작
	const startGame = () => {
		setGameKey((k) => k + 1);
		setSelectedWords(new Set());
		setCurrentWordIndex(0);
		setPhase("showing");
	};

	// 단어 보여주기 단계
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

	// 선택 단계 타이머
	useEffect(() => {
		if (phase !== "selecting" || timeLeft <= 0) return;
		const timer = setTimeout(() => setTimeLeft(timeLeft - 100), 100);
		return () => clearTimeout(timer);
	}, [phase, timeLeft]);

	// 시간 종료시 자동 제출
	useEffect(() => {
		if (phase === "selecting" && timeLeft <= 0) finishGame();
	}, [phase, timeLeft]);

	const MAX_SELECT = CONFIG.TARGET_COUNT; // = 8

	const toggleWord = (word: string) => {
		setSelectedWords((prev) => {
			const next = new Set(prev);
			if (next.has(word)) {
				next.delete(word); // 선택 해제는 항상 허용
				return next;
			}
			if (next.size >= MAX_SELECT) {
				return prev; // 8개 초과 선택 방지
			}
			next.add(word);
			return next;
		});
	};

	const finishGame = () => {
		const correctCount = targetWords.filter((w) => selectedWords.has(w)).length;
		setScore(correctCount);
		setPhase("finished");
	};

	const restartGame = () => {
		setGameKey((prev) => prev + 1);
		setPhase("ready");
	};

	const formatTime = (ms: number) => {
		const s = Math.max(0, Math.ceil(ms / 1000));
		const mm = String(Math.floor(s / 60)).padStart(2, "0");
		const ss = String(s % 60).padStart(2, "0");
		return `${mm}:${ss}`;
	};

	return (
		// ① 바깥: 화면 전체 가운데 정렬 + dvh
		<div className="flex flex-row justify-center w-full min-h-dvh bg-gray-50">
			{/* ② 안쪽: 모바일 폭 제한 + 세로 레이아웃 */}
			<div
				className="relative w-full max-w-md mx-auto flex flex-col px-8 
                      pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
			>
				{/* (선택) 상단 고정 헤더가 필요하면 */}
				{/* <header className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur px-1 py-3">...</header> */}

				{/* 메인: 단계별 화면을 중앙 배치 */}
				<main className="flex-1 flex flex-col">
					{/* READY */}
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

							{/* 마스코트 */}
							<img
								src="/meonjiTest.svg"
								alt="먼지치우기"
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

					{/* SHOWING */}
					{phase === "showing" && (
						<section className="flex-1 flex items-center justify-center text-center">
							<div
								className="w-[314px] h-[130px] bg-white shadow-sm
                              flex flex-col items-center justify-center
                              pt-[13px] pb-[20px] gap-[13px]"
							>
								<div className="text-3xl font-extrabold">
									{targetWords[currentWordIndex]}
								</div>
								<div className="text-sm text-gray-400 font-medium">
									{currentWordIndex + 1}/{targetWords.length}
								</div>
							</div>
						</section>
					)}

					{/* SELECTING */}
					{phase === "selecting" && (
						<section
							className="flex-1 flex flex-col items-center justify-center text-center gap-6"
							key={gameKey}
						>
							<p className="text-base font-medium">기억한 단어를 선택하세요!</p>

							<div className="text-h1 font-extrabold">
								{formatTime(timeLeft)}
							</div>

							{(() => {
								const limitReached = selectedWords.size >= MAX_SELECT;

								return (
									<div className="grid grid-cols-[repeat(5,51px)] gap-x-[15px] gap-y-[15px] justify-center">
										{allOptions.map((word) => {
											const active = selectedWords.has(word);
											const disabled = limitReached && !active; // 이미 8개면 새 선택 막기

											return (
												<button
													key={word}
													onClick={() => toggleWord(word)}
													aria-pressed={active}
													disabled={disabled}
													className={[
														"w-[51px] h-[71px] rounded-[3px]",
														"flex items-center justify-center transition",
														disabled ? "opacity-40 cursor-not-allowed" : "",
														active
															? "bg-yellow100 border border-yellowBorder"
															: "bg-white text-gray-900 shadow-sm ",
													].join(" ")}
												>
													<span className="text-[16px] font-semibold leading-none">
														{word}
													</span>
												</button>
											);
										})}
									</div>
								);
							})()}

							{/* 선택 개수 */}
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

					{/* FINISHED */}
					{phase === "finished" && (
						<section className="flex-1 flex items-center justify-center">
							<ResultView
								score={score}
								max={targetWords.length}
								targets={targetWords}
								onRestart={restartGame}
								onBackToHome={restartGame}
							/>
						</section>
					)}
				</main>

				{/* 하단 고정 버튼(선택 화면 등에서) */}
				{phase === "selecting" && (
					<footer
						className="sticky bottom-0 left-0 right-0 z-10 
                             bg-gray-50/80 backdrop-blur
                             -mx-4 px-4 pt-3 pb-4"
					>
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
