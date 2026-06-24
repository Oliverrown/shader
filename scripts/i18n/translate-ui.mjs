import { readFileSync, writeFileSync } from "node:fs"

// One-shot UI translator for the editor components.
// Replaces English UI strings ONLY in known UI contexts:
//   attribute="X" / attribute={"X"}, prop: "X", JSX text >X<,
//   ternary after ? or :, Record map values key: "X", renderFieldLabel("X").
// Brand/format/acronym/term tokens are intentionally kept English:
//   FPS, MP4, WebM, GIF, PNG, ASCII, CRT, GitHub, Cmd, Auto-Key, Alpha,
//   ACES, Reinhard, Bayer, CMYK, RGB, Impact, Lego, Risograph.

const dir = "src/components/editor"
const files = [
  "editor-topbar",
  "layer-picker",
  "layer-sidebar",
  "properties-sidebar",
  "properties-sidebar-content",
  "scene-config-content",
  "editor-export-dialog",
  "editor-timeline-overlay",
  "mobile-editor-dock",
  "curve-editor",
  "properties-sidebar-fields",
]

const dict = {
  // editor-topbar
  "Open Shader Lab on GitHub": "在 GitHub 上打开 Shader Lab",
  Drag: "拖动",
  Undo: "撤销",
  Redo: "重做",
  Revert: "还原",
  "Zoom out": "缩小",
  "Zoom in": "放大",
  Export: "导出",
  Download: "下载",
  "Reset view": "重置视图",
  "Reset layout": "重置布局",
  "Layer properties": "图层属性",
  "Scene settings": "场景设置",
  "Mute interface sounds": "静音界面音效",
  "Unmute interface sounds": "取消静音界面音效",
  "Mute sounds": "静音",
  "Unmute sounds": "取消静音",
  // layer-sidebar
  "Add layer": "添加图层",
  "Toggle visibility": "切换可见性",
  "Delete layer": "删除图层",
  "Reset properties": "重置属性",
  "Hide layer": "隐藏图层",
  "Show layer": "显示图层",
  "Hide UI (Cmd + .)": "隐藏界面 (Cmd + .)",
  "Failed to relink asset.": "重新关联素材失败。",
  // properties-sidebar
  "Move layers panel": "移动图层面板",
  "Move properties panel": "移动属性面板",
  "Select a layer to edit it.": "选择一个图层进行编辑。",
  Opacity: "不透明度",
  Hue: "色相",
  Saturation: "饱和度",
  General: "常规",
  Blend: "混合",
  Mode: "模式",
  Source: "源",
  "Mask Mode": "蒙版模式",
  "Effect Mode": "特效模式",
  "Entry Export": "入口导出",
  "Sketch Source": "Sketch 源代码",
  Apply: "应用",
  Gradient: "渐变",
  Randomize: "随机",
  Interaction: "交互",
  Clear: "清除",
  Stop: "停止",
  Record: "录制",
  Recording: "录制中",
  "No recording": "未录制",
  "Format sketch source": "格式化 sketch 源代码",
  "Could not format sketch source.": "无法格式化 sketch 源代码。",
  // properties-sidebar-fields
  Shadows: "阴影",
  Highlights: "高光",
  Midtones: "中间调",
  "High Mids": "中高调",
  // scene-config-content
  Composition: "构图",
  Aspect: "宽高比",
  Background: "背景",
  Color: "颜色",
  "Color Adjustments": "颜色调整",
  Exposure: "曝光",
  Brightness: "亮度",
  Contrast: "对比度",
  Vibrance: "自然饱和度",
  Temperature: "色温",
  Tint: "色调",
  Invert: "反相",
  "Output Mix": "输出混合",
  Curves: "曲线",
  Levels: "色阶",
  "Black Point": "黑场",
  "White Point": "白场",
  Gamma: "伽马",
  Quantize: "量化",
  Enabled: "启用",
  "Color Map": "颜色映射",
  Reset: "重置",
  Screen: "屏幕",
  Custom: "自定义",
  // curve-editor
  "Step Hold": "阶梯保持",
  "Curve Values": "曲线数值",
  "Preset matched": "已匹配预设",
  "Easing curve editor": "缓动曲线编辑器",
  "Edit easing curve": "编辑缓动曲线",
  Foundation: "基础",
  Out: "缓出",
  In: "缓入",
  "In Out": "缓入缓出",
  Expressive: "强调",
  // timeline
  "Close export dialog": "关闭导出对话框",
  "Stop playback": "停止播放",
  "Play timeline": "播放时间轴",
  "Pause playback": "暂停播放",
  "Disable loop": "禁用循环",
  "Enable loop": "启用循环",
  "Disable auto-key": "禁用自动关键帧",
  "Enable auto-key": "启用自动关键帧",
  "Timeline duration in seconds": "时间轴时长（秒）",
  "Collapse timeline panel": "收起时间轴面板",
  "Expand timeline panel": "展开时间轴面板",
  "Disable track": "禁用轨道",
  "Enable track": "启用轨道",
  Dur: "时长",
  // export dialog
  Draft: "草稿",
  High: "高",
  Standard: "标准",
  Ultra: "超高",
  Quality: "质量",
  Format: "格式",
  Duration: "时长",
  Snippet: "代码片段",
  Width: "宽度",
  Height: "高度",
  "Cancel Export": "取消导出",
  "Copying...": "复制中…",
  "Copy snippet": "复制片段",
  "Image export failed.": "图像导出失败。",
  "Export complete": "导出完成",
  "Video export cancelled.": "视频导出已取消。",
  "Video export failed.": "视频导出失败。",
  "Live recording requires the visible canvas to be ready.":
    "实时录制需要可见画布准备就绪。",
  "Live recording is not supported in this browser.":
    "此浏览器不支持实时录制。",
  "Live recording failed.": "实时录制失败。",
  "Shader Lab project exported.": "Shader Lab 项目已导出。",
  "Project export failed.": "项目导出失败。",
  "Project imported.": "项目已导入。",
  "Project import failed.": "项目导入失败。",
  "Shader export is not available for this project.":
    "该项目不支持着色器导出。",
  "Shader snippet copied to clipboard.": "着色器代码片段已复制到剪贴板。",
  "Could not copy shader snippet.": "无法复制着色器代码片段。",
  "Clipboard access is not available in this browser.":
    "此浏览器不支持剪贴板访问。",
  // layer-picker categories
  All: "全部",
  Core: "核心",
  Distort: "扭曲",
  Image: "图像",
  Video: "视频",
  Camera: "相机",
  Text: "文字",
  Fluid: "流体",
  "Pixel Trail": "像素拖尾",
  "Magnify Lens": "放大镜",
  "Mesh Gradient": "网格渐变",
  "Custom Shader": "自定义着色器",
  Ink: "墨水",
  Pattern: "图案",
  Dithering: "抖动",
  Halftone: "半调",
  "Particle Grid": "粒子网格",
  Pixelation: "像素化",
  Voxel: "体素",
  Posterize: "色调分离",
  Threshold: "阈值",
  Bloom: "辉光",
  Plotter: "绘图仪",
  "Circuit Bent": "电路弯曲",
  "Directional Blur": "方向模糊",
  "Pixel Sorting": "像素排序",
  Slice: "切片",
  "Edge Detect": "边缘检测",
  "Displacement Map": "置换贴图",
  "Chromatic Aberration": "色差",
  "Progressive Blur": "渐进模糊",
  "Fluted Glass": "竖纹玻璃",
  // mobile dock
  Layers: "图层",
  Properties: "属性",
  Scene: "场景",
  Actions: "操作",
  // layer-picker descriptions
  "Adds smeared glow and fluid bleed for neon ink-like edges.":
    "添加涂抹辉光与流体渗色，营造霓虹墨水般的边缘。",
  "Maps the source into repeatable woven and graphic textures.":
    "将源映射为可重复的编织与图形纹理。",
  "Adds scanlines, phosphor bloom, and display-era noise.":
    "添加扫描线、荧光辉光与显示器时代的噪点。",
  "Reduces color resolution into ordered or textured dithering.":
    "将颜色分辨率降为有序或纹理化的抖动。",
  "Breaks the image into a glowing particle matrix.":
    "将图像分解为发光的粒子矩阵。",
  "Adds a standalone highlight bloom pass to the incoming frame.":
    "为输入画面添加独立的高光辉光处理。",
  "Smears pixels linearly or radially for motion, focus, or depth.":
    "沿线性或径向涂抹像素，营造运动、聚焦或景深。",
  "Blur that ramps from sharp to soft across a controllable range.":
    "在可控范围内从清晰渐变到柔和的模糊。",
  "Compresses tones into fewer steps while keeping the image graphic.":
    "将色调压缩为更少的层级，同时保持图像的图形感。",
  "Converts the frame into graphic dot screens and print textures.":
    "将画面转换为图形网点屏与印刷纹理。",
  "Extracts contrast edges and turns them into graphic outlines.":
    "提取对比边缘并将其转化为图形轮廓。",
  "Groups neighboring pixels into larger blocks for a low-res look.":
    "将相邻像素归并为更大的色块，营造低分辨率观感。",
  "Offsets color channels for fringing and lens-separation effects.":
    "偏移颜色通道，制造边缘色散与镜头分离效果。",
  "Offsets horizontal slices into blocky glitch bands and streaks.":
    "将水平切片偏移成块状故障条带与拖影。",
  "Pen-plotter aesthetic with hatching, crosshatching, and ink simulation.":
    "笔式绘图仪美学，包含排线、交叉排线与墨水模拟。",
  "Pushes pixels along luminance to create warped displacement fields.":
    "沿亮度推移像素，生成扭曲的置换场。",
  "Quantizes the frame into isometric cubes; depth raises columns by luminance.":
    "将画面量化为等距立方体，按亮度抬升立柱高度。",
  "Renders luma-gated scanlines and bends them around a pull or push attractor.":
    "渲染受亮度控制的扫描线，并围绕吸引子进行拉伸或推挤弯曲。",
  "Ribbed lenticular glass distortion with subtle chromatic split.":
    "带细微色散分离的竖纹柱镜玻璃扭曲。",
  "Sorts neighboring pixels into streaks based on luma or color.":
    "依据亮度或颜色将相邻像素排序成条纹。",
  "Turns the frame into stark black and white with controllable cutoff and grain.":
    "将画面转为强烈的黑白，并可控制阈值与颗粒。",
  "Turns the image into text glyphs for a classic terminal look.":
    "将图像转换为文本字符，呈现经典终端风格。",
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const keys = Object.keys(dict).sort((a, b) => b.length - a.length)
const attr =
  "(?:aria-label|label|title|placeholder|tooltip|description|name|emptyMessage|message|ariaLabel)"
const prop =
  "(?:label|description|name|title|message|placeholder|tooltip|ariaLabel)"

let total = 0
const remaining = []
for (const f of files) {
  const path = `${dir}/${f}.tsx`
  let src = readFileSync(path, "utf8")
  for (const key of keys) {
    const e = esc(key)
    const zh = dict[key]
    const replacers = [
      [new RegExp(`(${attr}=)"${e}"`, "g"), `$1"${zh}"`],
      [new RegExp(`(${attr}=\\{)"${e}"(\\})`, "g"), `$1"${zh}"$2`],
      [new RegExp(`(\\b${prop}:\\s*)"${e}"`, "g"), `$1"${zh}"`],
      [new RegExp(`(toast\\.[a-zA-Z]+\\(\\s*)"${e}"`, "g"), `$1"${zh}"`],
      [new RegExp(`(renderFieldLabel\\(\\s*)"${e}"`, "g"), `$1"${zh}"`],
      // ternary / mapping value: after ? or : (newlines allowed before)
      [new RegExp(`([?:]\\s*)"${e}"`, "g"), `$1"${zh}"`],
      // JSX text on its own line or inline: >X<
      [new RegExp(`(>\\s*)${e}(\\s*<)`, "g"), `$1${zh}$2`],
    ]
    for (const [re, rep] of replacers) {
      const before = src
      src = src.replace(re, rep)
      if (src !== before) total++
    }
  }
  writeFileSync(path, src)

  // Report leftover English in UI contexts (attr/prop/ternary/JSX text).
  const ctx = new RegExp(
    `(?:${attr}=\\{?|\\b${prop}:\\s*|[?:]\\s*|>\\s*)"?([A-Z][A-Za-z][A-Za-z .'/-]*)"?`,
    "g"
  )
  for (const m of src.matchAll(ctx)) {
    const v = m[1].trim()
    // ignore acronyms/brands/format tokens and code identifiers
    if (
      /^(FPS|MP4|WebM|GIF|PNG|ASCII|CRT|GitHub|Cmd|Auto|Alpha|ACES|Reinhard|Bayer|CMYK|RGB|Impact|Lego|Risograph|Error|Editor|Promise|React|Math|Array|Record|String|Number|Boolean|CSSProperties|ArrowLeft|ArrowRight|ArrowUp|ArrowDown|Escape|Enter|Tab|Backspace|Delete|INPUT|SELECT|TEXTAREA)\b/.test(
        v
      )
    )
      continue
    if (/[A-Za-z]{2,}/.test(v)) remaining.push(`${f}: ${v}`)
  }
}
console.log(`Applied: ${total} (file,key) groups.`)
console.log("Remaining EN candidates:")
console.log([...new Set(remaining)].sort().join("\n"))
