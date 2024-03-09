'use client'

import { NextUIProvider } from '@nextui-org/react'

export function UiProvider({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            {children}
        </NextUIProvider>
    )
}