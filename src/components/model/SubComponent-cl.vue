<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useSceneStore } from '@/stores/sceneStore'

const sceneStore = useSceneStore()
const galleryContainer = ref(null)
let hoveredBox = null

const imageFiles = [
  {
    src: '/object-images/object0-c/darin-test.jpg'
  },
  {
    src: '/object-images/object0-c/inferno-test.png'
  },
  {
    src: '/object-images/object0-c/jyorougumo.png'
  },
  {
    src: '/object-images/object0-c/pandora.png'
  },
  {
    src: '/object-images/object0-c/rairakku-test.jpg'
  },
  {
    src: '/object-images/object0-c/tengoku-test.jpg'
  },
]

const nextPage = () => {
  sceneStore.whichModalSelected = 2004
}

const prevPage = () => {
  sceneStore.whichModalSelected = 2002
}

function resetHover(box) {
  if (!box) return
  const img = box.querySelector('img')
  box.style.transform = ''
  box.style.zIndex = ''
  if (img) img.style.transform = 'translateZ(0)'
}

function handlePointerMove(event) {
  const box = event.currentTarget
  if (!box) return

  if (hoveredBox && hoveredBox !== box) {
    resetHover(hoveredBox)
  }
  hoveredBox = box

  const img = box.querySelector('img')
  const rect = box.getBoundingClientRect()
  const x = event.clientX - rect.left - rect.width / 2
  const y = event.clientY - rect.top - rect.height / 2
  const rotateX = (y / rect.height) * -30
  const rotateY = (x / rect.width) * 30

  box.style.transform = `perspective(850px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
  box.style.zIndex = '2'

  if (img) {
    img.style.transform = `translateZ(120px) rotateX(${rotateX * 0.3}deg) rotateY(${rotateY * 0.3}deg)`
  }
}

function handlePointerLeave(event) {
  const box = event.currentTarget
  if (!box) return
  if (hoveredBox === box) hoveredBox = null
  resetHover(box)
}

function activateBoxes() {
  const container = galleryContainer.value
  if (!container) return

  container.querySelectorAll('.box').forEach((box, index) => {
    setTimeout(() => {
      box.classList.add('active')
    }, index * 80)
  })
}

onMounted(() => {
  activateBoxes()
  window.addEventListener('resize', activateBoxes)
})

onUnmounted(() => {
  window.removeEventListener('resize', activateBoxes)
  if (hoveredBox) resetHover(hoveredBox)
})
</script>

<template>
  <div class="works-container">
    <section>
      <h1 class="works-title">WORKS</h1>
    </section>


    <div class="gallery-container" ref="galleryContainer">
      <div
        v-for="(item, index) in imageFiles"
        :key="index"
        class="box"
        @pointermove="handlePointerMove"
        @pointerleave="handlePointerLeave"
      >
        <img :src="item.src" :alt="item.alt" />
        <p>{{ item.title }}</p>
      </div>
    </div>

    <div class="navigation">
      <button class="nav-btn" @click="prevPage">←</button>
      <button class="nav-btn" @click="nextPage">→</button>
    </div>
  </div>
</template>

<style scoped>
.works-container {
  width: 100%;
  min-height: 100%;
}

section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30vh;
}

.works-title {
  color: #111;
  font-size: clamp(2.5rem, 8vw, 4rem);
  font-weight: 600;
}

.gallery-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 20px;
}


.box {
  position: relative;
  width: 200px;
  height: 200px;
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.45s ease;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  opacity: 0;
  transform: translateY(50px) scale(0.96);
  transform-style: preserve-3d;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
}

.box img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.25s ease;
  transform: translateZ(0);
}

.box p {
  position: absolute;
  bottom: 10px;
  left: 10px;
  margin: 0;
  color: #111;
  font-size: 14px;
  font-weight: 600;
  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.8);
}

.box.active {
  transform: translateY(0) scale(1);
  opacity: 1;
}

.navigation {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 20px;
}

.nav-btn {
  background: transparent;
  border: none;
  font-size: 40px;
  cursor: pointer;
  color: #c46ac4;
  transition: transform 0.2s ease;
}

.nav-btn:hover {
  transform: scale(1.2);
}
</style>
