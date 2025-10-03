// src/app/sitemap.ts
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const base = "https://adhdquiz.store"; // ← 도메인
	const now = new Date();

	return [
		{
			url: `${base}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1,
		},
		// 페이지가 더 생기면 여기에 계속 추가
	];
}
