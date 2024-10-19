import type { Metadata } from "next";

import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

export const metadata: Metadata = {
    title: "CSS Color to Filter",
    description: "Generate css filter code for coloring",
};

type RootLayoutProps = {
    readonly children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en">
            <body>
                { children }
            </body>
        </html>
    );
}
