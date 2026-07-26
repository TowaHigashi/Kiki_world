<script setup>
import { useSceneStore } from '@/stores/sceneStore'

const sceneStore = useSceneStore()

const nextPage = () => {
  sceneStore.whichModalSelected = 2003
}

const prevPage = () => {
  sceneStore.whichModalSelected = 2006
}
</script>

<template>

  <h1>紀紀の世界</h1>

  <div class="circular-container">
    <div class="circle">
      <div class="logo"></div>
    </div>
  </div>

  <p class="description">
    ギターの音色と共に、言葉にならない想いを音楽へと変える。
    作詞・作曲を自身で手がけ、繊細な感情から力強いメッセージまで、唯一無二の世界観を描き続ける。
  </p>

  <div class="navigation">
    <button class="nav-btn" @click="prevPage">◀</button>
    <button class="nav-btn" @click="nextPage">▶</button>
  </div>

</template>

<style scoped>
.circular-container {
  display: flex;
  justify-content: center;
  margin: 40px 0;
}

.circle {
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(135deg, #e8e8e8 0%, #f5f5f5 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 180px;
  height: 180px;
  background-image: url('/object-images/object0-b/kiki-rogo.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.description {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  max-width: 500px;
  margin: 40px auto 0;
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
  transition: transform 0.2s;
}

.nav-btn:hover {
  transform: scale(1.2);
}
</style>