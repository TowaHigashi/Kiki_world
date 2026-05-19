import * as THREE from 'three'
import { useSceneStore } from '@/stores/sceneStore'

// 引数として受け取ったpositionとtargetを使って、カメラの移動目標をセットするコントローラー
// 実際の移動（lerp）処理は既存のCameraController.jsのupdateループ内で実行されます
export function useCameraController2() {
    const sceneStore = useSceneStore()

    const moveCamera = (position, target) => {
        if (position && position !== '') {
            sceneStore.targetPosition = new THREE.Vector3(...position)
        }
        
        if (target && target !== '') {
            sceneStore.targetLookAt = new THREE.Vector3(...target)
        }
    }

    return {
        moveCamera
    }
}
