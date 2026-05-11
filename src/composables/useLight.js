// light生成、sceneへadd、light返却

import * as THREE from 'three'

export function useLight(scene) {
    // directional
    const directionalLight = new THREE.DirectionalLight(
        0xffffff,
        2
    )

    directionalLight.position.set(5, 5, 5)

    directionalLight.castShadow = true

    scene.add(directionalLight)

    // ambient
    const ambientLight = new THREE.AmbientLight(
        0xffffff,
        0.5
    )

    scene.add(ambientLight)

    return {
        directionalLight,
        ambientLight,
    }
}