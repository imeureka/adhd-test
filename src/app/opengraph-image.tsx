import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ADHD 단어 기억 테스트";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "#fff8a6",
					fontSize: 60,
					fontWeight: 600,
				}}
			>
				<div>ADHD 단어 기억 테스트</div>
				<div style={{ fontSize: 30, marginTop: 20, opacity: 0.8 }}>
					집중력과 기억력을 테스트해보세요
				</div>
			</div>
		),
		{
			...size,
		}
	);
}
