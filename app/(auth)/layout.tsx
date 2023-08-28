import {ClerkProvider} from '@clerk/nextjs'
import { Inter } from 'next/font/google'

import '../globals.css'

//This is for SEO optimization
export const metadata = {
    title: 'Threads',
    description: "A NextJS Fullstack Application"
}

const inter = Inter({subsets: ["latin"]})

//this is to define custom layout for routes in (auth) folder different from global layout.tsx in app
export default function RootLayout({children} : {children: React.ReactNode}){
    return (
        <ClerkProvider>
            <html lang='en'>
                <body className={`${inter.className} bg-dark-1`}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    )
}