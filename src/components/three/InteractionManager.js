// クリック検知。raycasterでオブジェクトを判定して、userData.idを返す

import { useRaycaster }
    from '@/composables/useRaycaster'

export function useInteractionManager({
    container,
    scene,
    camera,
    mouse,
}) {
    const { cast } = useRaycaster()

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

        const intersects = cast({
            mouse,
            camera,
            objects: scene.children,
        })

        if (!intersects.length) return

        const target = intersects[0].object

        const id = target.userData?.id

        console.log('clicked:', id) // 現状コンソールに出すだけ

        return id
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