import type { Metadata } from "next";
import "./globals.css";

const site = {
	name: "먼지치우기",
	url: "https://adhdquiz.store", 
	title: "ADHD 단어 기억 테스트",
	description:
		"ADHD 단어 기억 퀴즈로 집중력을 체크해보세요. 8개의 단어를 기억하고 제한 시간 안에 맞춰보는 초간단 테스트.",
	ogImage: "/og.png",
};

export const metadata: Metadata = {
	metadataBase: new URL(site.url),
	title: {
		default: `${site.title} | ${site.name}`,
		template: `%s | ${site.name}`,
	},
	description: site.description,
	keywords: [
		"ADHD 테스트",
		"ADHD 단어 테스트",
		"집중력 테스트",
		"주의력 검사",
		"단어 기억 테스트",
		"ADHD quiz",
	],
	alternates: {
		canonical: "/", // 다국어 있으면 languages 추가
	},
	openGraph: {
		title: site.title,
		description: site.description,
		url: site.url,
		siteName: site.name,
		locale: "ko_KR",
		type: "website",
		images: [{ url: site.ogImage, width: 1200, height: 630 }],
	},
	twitter: {
		card: "summary_large_image",
		title: site.title,
		description: site.description,
		images: [site.ogImage],
	},
	icons: {
		icon: [
			{ url: "/favicon.svg", type: "image/svg+xml" },
			{ url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="ko">
			<body className="min-h-screen bg-gray100 text-zinc-900">{children}</body>
		</html>
	);
}
