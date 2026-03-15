//app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sileo'
import 'sileo/styles.css'
import { MaintenanceBanner } from '@/components/maintenance-banner'

export const metadata: Metadata = {
  title: 'Sistema de Asistencia Para Estudiantes de Prácticas y Servicio Social',
  description: 'Gestiona y monitorea las horas de servicio social y prácticas profesionales de los estudiantes de manera eficiente.',
  generator: 'Next.js 13 + Supabase',

  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
    other: [
      { rel: 'apple-touch-icon', url: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // Archer is applied via globals.css — no className needed on body
    <html lang="es" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <MaintenanceBanner />
          {children}
        </ThemeProvider>
        <Toaster position="top-center" options={{ roundness: 12, duration: 4000 }} />
        <Analytics />
      </body>
    </html>
  )
}