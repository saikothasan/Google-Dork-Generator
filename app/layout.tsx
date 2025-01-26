import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { ThemeProvider } from "@/components/ThemeProvider"
import { TelegramPrompt } from "@/components/TelegramPrompt"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Advanced Google Dork Generator | SEO and OSINT Tool",
  description:
    "Create powerful Google dorks for advanced SEO and OSINT. Generate, save, and share complex search queries effortlessly.",
  keywords: "Google dork, search query, information gathering, SEO, OSINT, web security",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Advanced Google Dork Generator | SEO and OSINT Tool",
    description: "Create powerful Google dorks for advanced SEO and OSINT.",
    url: "https://your-website.com",
    siteName: "Advanced Google Dork Generator",
    images: [
      {
        url: "https://your-website.com/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Advanced Google Dork Generator | SEO and OSINT Tool",
    description: "Create powerful Google dorks for advanced SEO and OSINT.",
    images: ["https://your-website.com/twitter-image.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex flex-col min-h-screen">
            <Header />
            <TelegramPrompt />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

