import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Forces the status bar and address bar color on Android/Chrome */}
        <meta name="theme-color" content="#060912" />

        {/* PWA Meta Tags for iOS */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CineVault" />
        
        {/* Link the Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        <ScrollViewStyleReset />
        
        {/* 👇 FORCES THE BACKGROUND TO BE DARK BEFORE REACT LOADS 👇 */}
        <style dangerouslySetInnerHTML={{ __html: `
          html, body, #root {
            background-color: #060912 !important;
            height: 100%;
            margin: 0;
            padding: 0;
          }
        `}} />
      </head>
      <body style={{ backgroundColor: '#060912' }}>{children}</body>
    </html>
  );
}