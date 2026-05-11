<script setup>
import { useSceneStore } from '@/stores/sceneStore'
import { Objects } from '@/data/objects'
import * as THREE from 'three'

const sceneStore = useSceneStore()

const handleBack = () => {
  const camera = sceneStore.camera
  const controls = sceneStore.controls

  if (!camera || !controls) return

  // 初期位置データ (id: 1001) を取得
  const config = Objects.find(obj => obj.id === 1001)
  if (!config) return

  // 目標値をセットしてアニメーションを開始
  if (config.position) {
    sceneStore.targetPosition = new THREE.Vector3(...config.position)
  }
  if (config.target) {
    sceneStore.targetLookAt = new THREE.Vector3(...config.target)
  }
}
</script>

<template>
  <Transition name="fade">
    <button 
      v-if="sceneStore.isUserStrolling" 
      class="back-button" 
      @click="handleBack"
      aria-label="初期位置に戻る"
    >
      <span class="icon">↺</span>
      <span class="text">BACK</span>
    </button>
  </Transition>
</template>

<style scoped>
.back-button {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 100;
  
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.back-button:active {
  transform: translateY(0);
}

.icon {
  font-size: 1.2rem;
}

/* フェードアニメーション */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
