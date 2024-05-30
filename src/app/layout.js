import { Providers } from '@/components/providers/providers';
import { montserrat } from '@/app/ui/fonts';

export const metadata = {
  title: 'Vendar',
  description: 'Rental space optimization.',
  icons: {
    icon: '/icon.png',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={montserrat.className}>
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  )
}
