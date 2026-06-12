import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* Apply saved theme before paint to avoid a flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=new URLSearchParams(location.search).get('theme');var t=p||localStorage.getItem('minefy-theme');if(p){localStorage.setItem('minefy-theme',p)}if(t==='light'){document.documentElement.classList.add('light')}else{document.documentElement.classList.remove('light')}}catch(e){}`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
