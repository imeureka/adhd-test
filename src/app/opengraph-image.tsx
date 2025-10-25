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
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "black",
				}}
			>
				{/* OG에 그대로 박을 이미지 */}
				<img
					src="https://adhdquiz.store/insta.png"
					alt="ADHD 단어 기억 테스트"
					style={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
					}}
				/>
			</div>
		),
		{
			...size,
		}
	);
}
