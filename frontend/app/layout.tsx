import './globals.css';
export const metadata = { title: 'TMS' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
          <h1>Task Management System</h1>
          {children}
        </main>
      </body>
    </html>
  )
}
