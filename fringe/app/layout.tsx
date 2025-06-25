import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import type {Metadata} from "next";
import {Geist} from "next/font/google";
import {ColorSchemeScript, MantineProvider, mantineHtmlProps} from '@mantine/core';
import Providers from "@/app/QueryProvider";
import {theme} from "@/theme";
import {Notifications} from "@mantine/notifications";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
export const metadata: Metadata = {
    description: "Official website of Fringe Festival",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" {...mantineHtmlProps}>
        <head>

            <title>Fringe Festival</title>
            <meta
                name="viewport"
                content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
            />
            <ColorSchemeScript defaultColorScheme="light"/>
        </head>
        <body className={`${geistSans.variable}`}>
        <Providers>
            <MantineProvider theme={theme}>
                <Notifications />
                {children}
            </MantineProvider>
        </Providers>
        </body>
        </html>
    );
}
