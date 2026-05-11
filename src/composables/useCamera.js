// camera生成。動かす処理は含まない

import * as THREE from 'three'
import { Objects } from '@/data/objects.js'

export function useCamera(container) {
    const camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
    )

    // Objectsからカメラ初期位置を取得
    const config = Objects.find(obj => obj.type === 'config')

    if (config && config.position) {
        camera.position.set(...config.position)
    } else {
        camera.position.set(0, 3, 10)
    }

    return {
        camera,
    }
}
