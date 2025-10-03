"use client";

import Image from "next/image";

export type ResultMeta = {
	title: string;
	subtitle: string;
	image: string; // /public/images 경로
};

export const RESULT_BY_SCORE: Record<number, ResultMeta> = {
	0: {
		title: "기억력 블랙아웃!",
		subtitle:
			"지금 머릿속이 백지장 같죠? 하지만 걱정 마세요. ‘먼지치우기’ 타이머로 할 일들을 쪼개다 보면 기억력도, 집중력도 덩달아 살아납니다.",
		image: "/meonji02.svg",
	},
	1: {
		title: "운빨 100%",
		subtitle:
			"하나 맞춘 건 기적에 가까워요. 집중이 잘 안 될 땐, 먼지 쌓인 방 치우듯 타이머로 할 일을 ‘싹’ 치워보세요. ‘먼지치우기’가 도와드려요.",
		image: "/meonji02.svg",
	},
	2: {
		title: "아슬아슬 세이프",
		subtitle:
			"단어가 손에 잡힐 듯 흘러갔네요. 할 일도 마찬가지 아닌가요? ‘먼지치우기’에서 타이머를 켜두면, 잊지 않고 바로 처리할 수 있어요.",
		image: "/meonji02.svg",
	},
	3: {
		title: "기억력, 아직 예열 중",
		subtitle:
			"살짝 아쉬운 점수! 할 일도 미루면 결국 날아가버려요. ‘먼지치우기’로 지금 생각난 일부터 기록하고, 타이머로 뽀개보세요.",
		image: "/meonji35.svg",
	},
	4: {
		title: "절반은 건졌다",
		subtitle:
			"집중력에 기본기는 있어요. 하지만 절반에 만족할 순 없죠. ‘먼지치우기’로 할 일을 반반씩 쪼개 처리하면, 집중력이 풀차지 됩니다.",
		image: "/meonji35.svg",
	},
	5: {
		title: "평타는 쳤다",
		subtitle:
			"기억력도 무난, 집중력도 무난. 근데 평타만 치면 인생이 재미없잖아요? ‘먼지치우기’ 타이머로 빡집중 한 번 해보세요. 차이가 확 납니다.",
		image: "/meonji35.svg",
	},
	6: {
		title: "집중력 모드 ON",
		subtitle:
			"이미 꽤 잘했어요. 이 기세로 기억하고 있는 할 일을 정리해보세요. ‘먼지치우기’에서 타이머 켜고 적어두면, 까먹을 틈 없이 바로 처리됩니다.",
		image: "/meonji68.svg",
	},
	7: {
		title: "기억력 고인물",
		subtitle:
			"거의 다 맞췄네요! 근데 현실에서 할 일은 아직 쌓여 있지 않나요? ‘먼지치우기’로 할 일을 정리하고 타이머로 뽀개면, 완벽에 가까워집니다.",
		image: "/meonji68.svg",
	},
	8: {
		title: "기억력 만렙 인증",
		subtitle:
			"천재 같아요. 하지만 머릿속만 천재면 뭐해요, 할 일이 그대로라면. ‘먼지치우기’로 할 일까지 싹 정리해서 현실까지 천재가 되어 보세요.",
		image: "/meonji68.svg",
	},
};

function getResultMeta(score: number): ResultMeta {
	const s = Math.max(0, Math.min(8, score));
	return RESULT_BY_SCORE[s];
}

export interface ResultViewProps {
	score: number;
	max: number;
	targets: string[];
	onRestart: () => void;
	onBackToHome?: () => void;
	onSolveClick?: () => void;
}

export default function ResultView({ score, max, onRestart }: ResultViewProps) {
	const meta = getResultMeta(score);

	const handleShare = async () => {
		const shareData = {
			title: "ADHD 단어 기억 테스트",
			text: `정답 ${max}개 중 ${score}개 맞췄어요!`,
			url: typeof window !== "undefined" ? window.location.href : "",
		};
		try {
			if (navigator.share) await navigator.share(shareData);
			else {
				await navigator.clipboard.writeText(
					`${shareData.text} ${shareData.url}`
				);
				alert("링크가 복사됐어요!");
			}
		} catch {}
	};

	return (
		<section className="min-h-screen flex items-center justify-center">
			<div className="w-full max-w-sm mx-auto text-center flex flex-col items-center gap-7">
				<div>
					<h1 className="text-[28px] font-extrabold tracking-tight">
						{meta.title}
					</h1>
					<p className="mt-5 text-sm text-zinc-500">{meta.subtitle}</p>
				</div>

				{/* 캐릭터 (SVG 경로) */}
				<Image
					src={meta.image}
					alt={meta.title}
					width={176}
					height={176}
					priority
					className="h-44 w-44 mx-auto"
				/>

				<p className="text-body2 text-gray-500 mt-2">
					정답 {max}개 중 <b className="text-zinc-900 text-h2">{score}개</b>{" "}
					맞춤!
				</p>

				<div className="mt-2 grid grid-cols-[1fr_auto] gap-3 w-full items-center">
					<button
						onClick={onRestart}
						className="h-[50px] w-full rounded-[12px] bg-gray50 text-zinc-900 font-semibold shadow-sm hover:bg-zinc-300 transition"
					>
						다시 풀기
					</button>
					<button
						onClick={handleShare}
						aria-label="공유"
						className="h-[50px] w-[64px] rounded-[12px] bg-yellow-100 text-gray-900 font-semibold shadow-sm hover:bg-yellow-200 transition"
					>
						공유
					</button>
				</div>

				<p className="text-body4">
					먼지치우기에서 원하는 만큼 반복해서
					<br />
					재도전 할 수 있어요.
				</p>
			</div>
		</section>
	);
}
