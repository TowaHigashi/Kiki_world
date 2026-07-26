<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import {
  Box3,
  CanvasTexture,
  LinearFilter,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
  Vector3,
  SRGBColorSpace,
  VideoTexture,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Objects } from '@/data/objects'
import { useSceneStore } from '@/stores/sceneStore'

const props = defineProps({
  scene: Object,
})

const sceneStore = useSceneStore()

const MODEL_PATH = '/models/screen.glb'
const VIDEO_PATH = '/videos/screen.mp4'

let videoElement = null
let videoTexture = null
let videoMaterial = null
let screenMesh = null
let screenOriginalMaterial = null
let pauseMarker = null
let pauseMarkerTexture = null
let pauseMarkerMaterial = null

const isVideoPaused = computed(() => sceneStore.isScreenVideoPaused)

const fitVideoToMesh = (mesh, texture) => {
  if (!mesh || !texture) return

  const bounds = new Box3().setFromObject(mesh)
  const size = new Vector3()
  bounds.getSize(size)

  const meshAspect = size.y > 0 ? size.x / size.y : 1
  const videoAspect =
    videoElement?.videoWidth && videoElement?.videoHeight
      ? videoElement.videoWidth / videoElement.videoHeight
      : 1

  if (meshAspect > videoAspect) {
    const scale = videoAspect / meshAspect
    texture.repeat.set(1, scale)
    texture.offset.set(0, (1 - scale) / 2)
  } else {
    const scale = meshAspect / videoAspect
    texture.repeat.set(scale, 1)
    texture.offset.set((1 - scale) / 2, 0)
  }

  texture.needsUpdate = true
}

const createPauseMarkerTexture = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256

  const context = canvas.getContext('2d')
  if (!context) return null

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = 'rgba(0, 0, 0, 0.48)'
  context.beginPath()
  context.arc(128, 128, 92, 0, Math.PI * 2)
  context.fill()

  context.lineWidth = 6
  context.strokeStyle = 'rgba(255, 255, 255, 0.9)'
  context.beginPath()
  context.arc(128, 128, 92, 0, Math.PI * 2)
  context.stroke()

  context.fillStyle = 'rgba(255, 255, 255, 0.95)'
  context.beginPath()
  context.roundRect(92, 82, 22, 92, 999)
  context.fill()
  context.beginPath()
  context.roundRect(142, 82, 22, 92, 999)
  context.fill()

  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.minFilter = LinearFilter
  texture.magFilter = LinearFilter
  texture.generateMipmaps = false

  return texture
}

const createPauseMarker = () => {
  if (!screenMesh) return null

  pauseMarkerTexture = createPauseMarkerTexture()
  if (!pauseMarkerTexture) return null

  pauseMarkerMaterial = new SpriteMaterial({
    map: pauseMarkerTexture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  })

  pauseMarker = new Sprite(pauseMarkerMaterial)
  pauseMarker.renderOrder = 999
  pauseMarker.visible = sceneStore.isScreenVideoPaused
  pauseMarker.scale.set(1.1, 1.1, 1)

  const bounds = new Box3().setFromObject(screenMesh)
  const center = new Vector3()
  bounds.getCenter(center)
  screenMesh.worldToLocal(center)

  pauseMarker.position.copy(center)
  pauseMarker.userData = {
    ignoreInteraction: true,
  }

  screenMesh.add(pauseMarker)

  return pauseMarker
}

const disposeVideoResources = () => {
  if (videoElement) {
    videoElement.pause()
    videoElement.removeAttribute('src')
    videoElement.load()
    videoElement = null
  }

  if (screenMesh && videoMaterial) {
    screenMesh.material = screenOriginalMaterial
  }

  if (videoTexture) {
    videoTexture.dispose()
    videoTexture = null
  }

  if (videoMaterial) {
    videoMaterial.dispose()
    videoMaterial = null
  }

  if (pauseMarker && pauseMarker.parent) {
    pauseMarker.parent.remove(pauseMarker)
  }

  if (pauseMarkerMaterial) {
    pauseMarkerMaterial.dispose()
    pauseMarkerMaterial = null
  }

  if (pauseMarkerTexture) {
    pauseMarkerTexture.dispose()
    pauseMarkerTexture = null
  }

  pauseMarker = null
}

const syncVideoState = async (paused) => {
  if (!videoElement) return

  if (paused) {
    videoElement.pause()
    return
  }

  try {
    await videoElement.play()
  } catch {
    sceneStore.isScreenVideoPaused = true
  }
}

const toggleScreenVideo = () => {
  sceneStore.isScreenVideoPaused = !sceneStore.isScreenVideoPaused
}

watch(
  isVideoPaused,
  (paused) => {
    syncVideoState(paused)

    if (pauseMarker) {
      pauseMarker.visible = paused
    }
  },
  { immediate: true }
)

onMounted(() => {
  const loader = new GLTFLoader()
  const objectData = Objects.find(
    (object) => object.path === MODEL_PATH
  )

  const videoPath = objectData?.videoPath || VIDEO_PATH

  videoElement = document.createElement('video')
  videoElement.src = videoPath
  videoElement.crossOrigin = 'anonymous'
  videoElement.loop = true
  videoElement.muted = true
  videoElement.playsInline = true
  videoElement.autoplay = true
  videoElement.preload = 'auto'

  videoTexture = new VideoTexture(videoElement)
  videoTexture.colorSpace = SRGBColorSpace
  videoTexture.minFilter = LinearFilter
  videoTexture.magFilter = LinearFilter
  videoTexture.generateMipmaps = false

  videoMaterial = new MeshBasicMaterial({
    map: videoTexture,
    toneMapped: false,
  })

  const startVideo = () => {
    if (sceneStore.isScreenVideoPaused) return
    videoElement?.play().catch(() => {})
  }

  videoElement.addEventListener('canplay', startVideo, { once: true })
  videoElement.addEventListener(
    'loadedmetadata',
    () => {
      if (screenMesh && videoTexture) {
        fitVideoToMesh(screenMesh, videoTexture)
      }
    },
    { once: true }
  )

  loader.load(MODEL_PATH, (gltf) => {
    const model = gltf.scene

    if (objectData?.position) {
      model.position.set(
        ...objectData.position
      )
    }

    if (objectData?.rotation) {
      model.rotation.set(
        ...objectData.rotation
      )
    }

    if (objectData?.scale) {
      model.scale.set(
        ...objectData.scale
      )
    }

    model.updateWorldMatrix(true, true)

    model.traverse((child) => {
      if (child.isMesh) {
        if (child.name === 'Cube' && videoMaterial) {
          screenMesh = child
          screenOriginalMaterial = child.material
          child.material = videoMaterial

          createPauseMarker()

          if (videoElement.readyState >= 1) {
            fitVideoToMesh(child, videoTexture)
          }
        }

        child.userData = {
          ...child.userData,

          type: objectData?.type,
          fileName: objectData?.fileName,
          path: objectData?.path,

          position: objectData?.position,

          target: objectData?.target,

          name: objectData?.name,

          id: objectData?.id,

          cameraFocusIn:
            objectData?.cameraFocusIn,

          cameraFocusOut:
            objectData?.cameraFocusOut,
        }
      }
    })

    props.scene.add(model)
  })
})

onBeforeUnmount(() => {
  disposeVideoResources()
})
</script>

<template>
  <div class="screen-status-indicator" aria-label="screen video status">
    <button
      type="button"
      class="status-button"
      :aria-label="sceneStore.isScreenVideoPaused ? '再生する' : '停止する'"
      :aria-pressed="!sceneStore.isScreenVideoPaused"
      @click="toggleScreenVideo"
    >
      <div
      v-if="sceneStore.isScreenVideoPaused"
      class="status-icon pause"
      aria-label="停止中"
    >
      <span></span>
      <span></span>
    </div>
      <div
      v-else
      class="status-icon play"
      aria-label="再生中"
    >
      <span></span>
    </div>
    </button>
  </div>
</template>

<style scoped>
.screen-status-indicator {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 120;
}

.status-button {
  appearance: none;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
}

.status-icon {
  width: 52px;
  height: 52px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.42);
  border: 2px solid rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(6px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.22);
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon.pause {
  gap: 7px;
}

.status-icon.pause span {
  display: block;
  width: 6px;
  height: 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
}

.status-icon.play span {
  display: block;
  width: 0;
  height: 0;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 16px solid rgba(255, 255, 255, 0.96);
  margin-left: 4px;
}
</style>