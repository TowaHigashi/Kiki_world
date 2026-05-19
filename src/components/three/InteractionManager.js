// クリック検知。raycasterでオブジェクトを判定して、userData.idを返す

import { useRaycaster }
    from '@/composables/useRaycaster'
import { Objects } from '@/data/objects.js'
import { useCameraController2 } from '@/components/three/CameraController2'
import { useSceneStore } from '@/stores/sceneStore'

export function useInteractionManager({
    container,
    scene,
    camera,
    mouse,
}) {
    const { cast } = useRaycaster()
    const cameraController2 = useCameraController2()
    const sceneStore = useSceneStore()

    let startX = 0
    let startY = 0

    let isDragging = false

    // drag判定閾値
    const DRAG_THRESHOLD = 5

    // pointer down
    const handlePointerDown = (event) => {
        startX = event.clientX
        startY = event.clientY

        isDragging = false
    }

    // pointer move
    const handlePointerMove = (event) => {
        const deltaX =
            event.clientX - startX

        const deltaY =
            event.clientY - startY

        const distance = Math.sqrt(
            deltaX * deltaX +
            deltaY * deltaY
        )

        if (distance > DRAG_THRESHOLD) {
            isDragging = true
        }
    }

    // click
    const handleClick = () => {
        // drag中は無視
        if (isDragging) return

        // 開発用：クリック時点でのカメラの座標と注視点をコンソールに出力
        if (sceneStore.controls) {
            const format = (arr) => arr.map(v => Number(v.toFixed(3)))
            console.log('--- Current View ---')
            console.log('position: ', format(camera.position.toArray()))
            console.log('target:   ', format(sceneStore.controls.target.toArray()))
            console.log('--------------------')
        }

        const intersects = cast({
            mouse,
            camera,
            objects: scene.children,
        })

        if (!intersects.length) return

        const target = intersects[0].object

        const id = target.userData?.id

        // idからオブジェクトデータを取得し、cameraFocusIn.positionとtargetを取り出す
        const objectData = Objects.find(obj => obj.id === id)
        const cameraFocusInPosition = objectData?.cameraFocusIn?.position || null
        const cameraFocusInTarget = objectData?.cameraFocusIn?.target || null

        if (cameraFocusInPosition && cameraFocusInPosition !== '') {
            console.log('clicked id:', id, 'moving to:', cameraFocusInPosition)

            // オブジェクト1-6クリック時（cameraFocusIn.position!=null）、ameraController2を呼び出してカメラ移動を実行
            cameraController2.moveCamera(cameraFocusInPosition, cameraFocusInTarget)

            return { id, position: cameraFocusInPosition }
        } else {
            console.log('clicked id:', id)
            return id
        }
    }

    container.addEventListener(
        'pointerdown',
        handlePointerDown
    )

    container.addEventListener(
        'pointermove',
        handlePointerMove
    )

    container.addEventListener(
        'click',
        handleClick
    )

    const destroy = () => {
        container.removeEventListener(
            'pointerdown',
            handlePointerDown
        )

        container.removeEventListener(
            'pointermove',
            handlePointerMove
        )

        container.removeEventListener(
            'click',
            handleClick
        )
    }

    return {
        destroy,
    }
}