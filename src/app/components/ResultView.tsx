"use client";

import Image from "next/image";
import { useState } from "react";
import { sendEvent } from "../utils/ga";

export type ResultMeta = {
	title: string;
	subtitle: string;
	image: string;
};

export const RESULT_BY_SCORE: Record<number, ResultMeta> = {
	0: {
		title: "기억력 블랙아웃!",
		subtitle:
			"지금 머릿속이 백지장 같죠? 하지만 걱정 마세요. '먼지치우기' 타이머로 할 일들을 쪼개다 보면 기억력도, 집중력도 덩달아 살아납니다.",
		image: "/meonji02.svg",
	},
	1: {
		title: "운빨 100%",
		subtitle:
			"하나 맞춘 건 기적에 가까워요. 집중이 잘 안 될 땐, 먼지 쌓인 방 치우듯 타이머로 할 일을 '싹' 치워보세요. '먼지치우기'가 도와드려요.",
		image: "/meonji02.svg",
	},
	2: {
		title: "아슬아슬 세이프",
		subtitle:
			"단어가 손에 잡힐 듯 흘러갔네요. 할 일도 마찬가지 아닌가요? '먼지치우기'에서 타이머를 켜두면, 잊지 않고 바로 처리할 수 있어요.",
		image: "/meonji02.svg",
	},
	3: {
		title: "기억력, 아직 예열 중",
		subtitle:
			"살짝 아쉬운 점수! 할 일도 미루면 결국 날아가버려요. '먼지치우기'로 지금 생각난 일부터 기록하고, 타이머로 뽀개보세요.",
		image: "/meonji35.svg",
	},
	4: {
		title: "절반은 건졌다",
		subtitle:
			"집중력에 기본기는 있어요. 하지만 절반에 만족할 순 없죠. '먼지치우기'로 할 일을 반반씩 쪼개 처리하면, 집중력이 풀차지 됩니다.",
		image: "/meonji35.svg",
	},
	5: {
		title: "평타는 쳤다",
		subtitle:
			"기억력도 무난, 집중력도 무난. 근데 평타만 치면 인생이 재미없잖아요? '먼지치우기' 타이머로 빡집중 한 번 해보세요. 차이가 확 납니다.",
		image: "/meonji35.svg",
	},
	6: {
		title: "집중력 모드 ON",
		subtitle:
			"이미 꽤 잘했어요. 이 기세로 기억하고 있는 할 일을 정리해보세요. '먼지치우기'에서 타이머 켜고 적어두면, 까먹을 틈 없이 바로 처리됩니다.",
		image: "/meonji68.svg",
	},
	7: {
		title: "기억력 고인물",
		subtitle:
			"거의 다 맞췄네요! 근데 현실에서 할 일은 아직 쌓여 있지 않나요? '먼지치우기'로 할 일을 정리하고 타이머로 뽀개면, 완벽에 가까워집니다.",
		image: "/meonji68.svg",
	},
	8: {
		title: "기억력 만렙 인증",
		subtitle:
			"천재 같아요. 하지만 머릿속만 천재면 뭐해요, 할 일이 그대로라면. '먼지치우기'로 할 일까지 싹 정리해서 현실까지 천재가 되어 보세요.",
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
}

export default function ResultView({ score, max }: ResultViewProps) {
	const meta = getResultMeta(score);
	const [showModal, setShowModal] = useState(false);

	const isIOS =
		typeof navigator !== "undefined" &&
		/iPad|iPhone|iPod/.test(navigator.userAgent);

	const APP_SCHEME = "monjitimer://todo?autoAdd=true";
	const APP_STORE_IOS = "itms-apps://itunes.apple.com/app/id6748334514";
	const APP_STORE_HTTP =
		"https://apps.apple.com/kr/app/%EB%A8%BC%EC%A7%80%EC%B9%98%EC%9A%B0%EA%B8%B0-%ED%83%80%EC%9D%B4%EB%A8%B8-%ED%95%A0-%EC%9D%BC-%EC%A7%91%EC%A4%91/id6748334514";

	// "다시 풀기" 버튼 클릭 → 모달 표시
	const handleRetryClick = () => {
		sendEvent("adhd_retry_click", { score });
		setShowModal(true);
	};

	// "앱으로 가기" 버튼 클릭 → 딥링크 시도 + 스토어 폴백
	const handleGoToApp = () => {
		sendEvent("adhd_open_app_click", {
			score,
			platform: isIOS ? "ios" : "android",
		});

		if (typeof window === "undefined") return;

		const APP_SCHEME = "monjitimer://";
		const APP_STORE_IOS = "itms-apps://itunes.apple.com/app/id6748334514";
		const APP_STORE_HTTP =
			"https://apps.apple.com/kr/app/%EB%A8%BC%EC%A7%80%EC%B9%98%EC%9A%B0%EA%B8%B0-%ED%83%80%EC%9D%B4%EB%A8%B8-%ED%95%A0-%EC%9D%BC-%EC%A7%91%EC%A4%91/id6748334514";

		const storeURL = isIOS ? APP_STORE_IOS : APP_STORE_HTTP;

		// 1️⃣ 커스텀 스킴 시도 (iframe 방식)
		const iframe = document.createElement("iframe");
		iframe.style.display = "none";
		iframe.src = APP_SCHEME;
		document.body.appendChild(iframe);

		// 2️⃣ 일정 시간 후 fallback (앱 미설치 시 앱스토어로)
		const start = Date.now();
		setTimeout(() => {
			const elapsed = Date.now() - start;
			if (elapsed < 1800) {
				// iframe 실패 → 앱스토어 링크를 직접 클릭 방식으로 실행
				const a = document.createElement("a");
				a.href = storeURL;
				a.target = "_blank";
				a.rel = "noopener noreferrer";
				a.click();
			}
			document.body.removeChild(iframe);
		}, 1500);

		setShowModal(false);
	};

	// 모달 backdrop 클릭 시 닫기
	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			sendEvent("adhd_retry_modal_close", { score }); // 닫기 이벤트 추가
			setShowModal(false);
		}
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

				<div className="mt-2 w-full">
					<button
						onClick={handleRetryClick}
						className="h-[50px] w-full rounded-[12px] bg-yellow-100 font-semibold shadow-sm hover:bg-yellowBorder transition"
					>
						다시 풀기
					</button>
				</div>

				<p className="text-body4 mt-3 text-zinc-500">
					먼지치우기에서 원하는 만큼
					<br />
					반복해서 재도전 할 수 있어요.
				</p>
			</div>

			{/* 모달 */}
			{showModal && (
				<div
					className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 px-4"
					onClick={handleBackdropClick}
				>
					<div className="bg-white rounded-[20px] p-8 max-w-sm w-full text-center">
						<h2 className="text-[22px] font-bold mb-4">
							다시 풀기는 먼지치우기
							<br />
							앱에서만 가능해요!
						</h2>

						<Image
							src="/meonji35.svg"
							alt="먼지 이미지"
							width={120}
							height={120}
							className="mx-auto my-6"
						/>

						<button
							onClick={handleGoToApp}
							className="h-[50px] w-full rounded-[12px] bg-yellow-100 font-semibold shadow-sm hover:bg-yellow-200 transition"
						>
							앱으로 가기
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
