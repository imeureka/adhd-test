"use client";

import Script from "next/script";

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			{/* Google Analytics 4 */}
			<Script
				strategy="afterInteractive"
				src="https://www.googletagmanager.com/gtag/js?id=G-EPL87XYSDG"
			/>
			<Script
				id="ga4-init"
				strategy="afterInteractive"
				dangerouslySetInnerHTML={{
					__html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EPL87XYSDG', {
              page_path: window.location.pathname,
            });
          `,
				}}
			/>
			{children}
		</>
	);
}
