import type { LabProjectFile } from "@/lib/editor/project-file"
import type {
  EditorAsset,
  EditorLayer,
  SceneConfig,
  Size,
  TimelineTrack,
} from "@/types/editor"
import { DEFAULT_SCENE_CONFIG } from "@/types/editor"
import defaultProjectJson from "./default-project.json"

type DefaultProjectFile = LabProjectFile & {
  assets: EditorAsset[]
  sceneConfig?: SceneConfig
}

const DEFAULT_PROJECT = defaultProjectJson as unknown as DefaultProjectFile

export function getDefaultProjectFile(): LabProjectFile {
  return structuredClone(DEFAULT_PROJECT)
}

export function getDefaultProjectComposition(): Size {
  return structuredClone(DEFAULT_PROJECT.composition)
}

export function getDefaultProjectAssets(): EditorAsset[] {
  return structuredClone(DEFAULT_PROJECT.assets)
}

export function getDefaultProjectSceneConfig(): SceneConfig {
  return structuredClone(DEFAULT_PROJECT.sceneConfig ?? DEFAULT_SCENE_CONFIG)
}

export function getDefaultProjectLayers(): EditorLayer[] {
  return structuredClone(DEFAULT_PROJECT.layers)
}

export function getDefaultProjectSelectedLayerId(): string | null {
  return DEFAULT_PROJECT.selectedLayerId
}

export function getDefaultProjectTimeline(): {
  duration: number
  loop: boolean
  tracks: TimelineTrack[]
} {
  return structuredClone(DEFAULT_PROJECT.timeline)
}
