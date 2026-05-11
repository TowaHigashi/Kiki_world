// 当たり判定機能。raycaster.setFromCamera()やintersectObjects()など

import * as THREE from 'three'

export function useRaycaster() {
    const raycaster = new THREE.Raycaster()

    const cast = ({
        mouse,
        camera,
        objects,
    }) => {
        raycaster.setFromCamera(mouse, camera)

        // intersectObjects()は第2引数にtrueを指定することで、入れ子オブジェクトも検索可能
        const intersects =
            raycaster.intersectObjects(objects, true)

        return intersects
    }

    return {
        raycaster,
        cast,
    }
}