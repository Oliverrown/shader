import type {
  EditorHistorySnapshot,
  TimelineStateSnapshot,
} from "@/types/editor"
import { useLayerStore } from "@/store/layer-store"
import { useTimelineStore } from "@/store/timeline-store"

type HistoryTimelineSnapshot = EditorHistorySnapshot["timeline"]

function cloneHistoryTimeline(
  timeline: Pick<
    TimelineStateSnapshot,
    | "currentTime"
    | "duration"
    | "loop"
    | "selectedKeyframeId"
    | "selectedKeyframeIds"
    | "selectedTrackId"
    | "tracks"
  >,
): HistoryTimelineSnapshot {
  return structuredClone({
    currentTime: timeline.currentTime,
    duration: timeline.duration,
    loop: timeline.loop,
    selectedKeyframeId: timeline.selectedKeyframeId,
    selectedKeyframeIds: timeline.selectedKeyframeIds,
    selectedTrackId: timeline.selectedTrackId,
    tracks: timeline.tracks,
  })
}

export function buildEditorHistorySnapshotFromState(
  layerState: Pick<
    ReturnType<typeof useLayerStore.getState>,
    "hoveredLayerId" | "layers" | "selectedLayerId"
  >,
  timelineState: Pick<
    TimelineStateSnapshot,
    | "currentTime"
    | "duration"
    | "loop"
    | "selectedKeyframeId"
    | "selectedKeyframeIds"
    | "selectedTrackId"
    | "tracks"
  >,
): EditorHistorySnapshot {
  return {
    hoveredLayerId: layerState.hoveredLayerId,
    layers: structuredClone(layerState.layers),
    selectedLayerId: layerState.selectedLayerId,
    timeline: cloneHistoryTimeline(timelineState),
  }
}

export function buildEditorHistorySnapshot(): EditorHistorySnapshot {
  return buildEditorHistorySnapshotFromState(
    useLayerStore.getState(),
    useTimelineStore.getState(),
  )
}

export function applyEditorHistorySnapshot(snapshot: EditorHistorySnapshot): void {
  useLayerStore
    .getState()
    .replaceState(snapshot.layers, snapshot.selectedLayerId, snapshot.hoveredLayerId)
  useTimelineStore.getState().replaceState({
    currentTime: snapshot.timeline.currentTime,
    duration: snapshot.timeline.duration,
    isPlaying: false,
    loop: snapshot.timeline.loop,
    selectedKeyframeId: snapshot.timeline.selectedKeyframeId,
    selectedKeyframeIds: snapshot.timeline.selectedKeyframeIds,
    selectedTrackId: snapshot.timeline.selectedTrackId,
    tracks: snapshot.timeline.tracks,
  })
}

export function getHistorySnapshotSignature(snapshot: EditorHistorySnapshot): string {
  // `currentTime` is a transient playback value that advances ~60x/sec during
  // playback. Including it here would make every animation frame register as a
  // distinct "change", continuously firing the history subscribers and causing
  // an infinite update loop. Playhead position is intentionally not part of
  // undo/redo change detection.
  const { currentTime: _currentTime, ...timelineSignature } = snapshot.timeline

  return JSON.stringify({
    layers: snapshot.layers,
    timeline: timelineSignature,
  })
}
