"use client"

import { CaretDownIcon } from "@phosphor-icons/react"
import Link from "next/link"
import { type FocusEvent, useEffect, useRef, useState } from "react"

const CLOSE_DELAY_MS = 130

const PRODUCTS = [
  {
    description: "移除水印，导出 4K 视频",
    href: "https://lottieair.superopc.app/",
    name: "Lottie Air",
  },
  {
    description: "创建叠加动画着色器",
    href: "https://shader.superopc.app/",
    name: "Shader",
  },
  {
    description: "ASCII 抖动，实时预览",
    href: "https://ascii.superopc.app/",
    name: "Ascii",
  },
  {
    description: "鼠标揭示，法线光影",
    href: "https://athens.superopc.app/",
    name: "Athens",
  },
] as const

const CURRENT_PRODUCT = PRODUCTS[1]

function ShaderLogo() {
  return (
    <span
      aria-hidden="true"
      className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-[8px] border border-white/14 bg-[radial-gradient(circle_at_32%_24%,rgb(255_255_255_/_0.36),transparent_34%),linear-gradient(135deg,#d7f45e_0%,#6d7b25_48%,#11150a_100%)] shadow-[inset_0_1px_0_rgb(255_255_255_/_0.22),0_8px_20px_rgb(0_0_0_/_0.35)]"
    >
      <span className="relative font-[var(--ds-font-mono)] font-bold text-[17px] text-black/76 leading-none">
        S
      </span>
    </span>
  )
}

export function ProductSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  function clearCloseTimer() {
    if (closeTimerRef.current === null) {
      return
    }

    window.clearTimeout(closeTimerRef.current)
    closeTimerRef.current = null
  }

  function openMenu() {
    clearCloseTimer()
    setIsOpen(true)
  }

  function scheduleClose() {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false)
      closeTimerRef.current = null
    }, CLOSE_DELAY_MS)
  }

  function scheduleCloseWhenFocusLeaves(event: FocusEvent<HTMLElement>) {
    const nextTarget = event.relatedTarget

    if (
      nextTarget instanceof Node &&
      event.currentTarget.parentElement?.contains(nextTarget)
    ) {
      return
    }

    scheduleClose()
  }

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    }
  }, [])

  return (
    <div
      className="pointer-events-auto fixed top-4 left-4 z-[2147483647] flex w-max flex-col items-start gap-0"
      onPointerEnter={openMenu}
      onPointerLeave={scheduleClose}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="inline-flex h-12 items-center gap-2 rounded-[8px] px-2 transition-colors duration-160 ease-[var(--ease-out-cubic)] hover:bg-white/6 focus:bg-white/6"
        onBlur={scheduleCloseWhenFocusLeaves}
        onFocus={openMenu}
        type="button"
      >
        <ShaderLogo />
        <span className="font-bold text-[16px] text-[var(--ds-color-text-primary)] leading-5">
          {CURRENT_PRODUCT.name}
        </span>
        <CaretDownIcon
          aria-hidden="true"
          className="h-4 w-4 text-white/45 transition-transform duration-160 ease-[var(--ease-out-cubic)]"
          weight="bold"
        />
      </button>

      {isOpen ? (
        <>
          <span aria-hidden="true" className="h-2 w-full" />
          <div
            className="z-[2147483647] w-[224px] rounded-[12px] border border-white/12 bg-[rgb(18_18_22_/_0.96)] p-2 shadow-[0_20px_50px_rgb(0_0_0_/_0.45)] backdrop-blur-[24px]"
            onBlur={scheduleCloseWhenFocusLeaves}
            onFocus={openMenu}
            role="menu"
          >
            <div className="flex flex-col gap-0">
              {PRODUCTS.map((product) => (
                <Link
                  aria-current={
                    product.name === CURRENT_PRODUCT.name ? "page" : undefined
                  }
                  className="relative block rounded-[10px] px-4 py-3 text-left transition-colors duration-160 ease-[var(--ease-out-cubic)] hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                  href={product.href}
                  key={product.href}
                  role="menuitem"
                >
                  <span className="block font-semibold text-[14px] text-white/90 leading-5">
                    {product.name}
                  </span>
                  <span className="mt-0.5 block text-[12px] text-white/52 leading-4">
                    {product.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  )
}
