import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/src/components/Navigation'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Glowi',
  description: 'Glowi athlete and club management dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-slate-50 text-slate-900">
        <Navigation />

        <main className="mx-auto min-h-screen max-w-6xl px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}