import { GitHubLogoIcon } from "@radix-ui/react-icons"
import Link from "next/link"
import { EditorCanvasViewport } from "@/components/editor/editor-canvas-viewport"
import { MobileEditorDock } from "@/components/editor/mobile-editor-dock"
import { EditorShortcuts } from "@/components/editor/editor-shortcuts"
import { EditorTimelineOverlay } from "@/components/editor/editor-timeline-overlay"
import { EditorTopBar } from "@/components/editor/editor-topbar"
import { LayerSidebar } from "@/components/editor/layer-sidebar"
import { PropertiesSidebar } from "@/components/editor/properties-sidebar"
import { ProductSwitcher } from "@/components/pages/product-switcher"

export function ShaderLabPage() {
  return (
    <main
      id="main-content"
      className="relative h-screen w-screen overflow-hidden bg-[var(--ds-color-canvas)]"
    >
      <EditorShortcuts />
      <EditorCanvasViewport />
      <EditorTimelineOverlay />
      <ProductSwitcher />
      <EditorTopBar />
      <LayerSidebar />
      <PropertiesSidebar />
      <MobileEditorDock />
      <Link
        href="https://eng.basement.studio/tools/shader-lab"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-3 left-3 z-50 inline-flex items-center gap-1.5 text-white/50 text-xs leading-4 transition-colors hover:text-white/80 min-[900px]:bottom-[28px]"
      >
        <GitHubLogoIcon height={14} width={14} />
        此为 basement 开源项目翻译版
      </Link>
    </main>
  )
}
