// mouse座標取得

import { reactive } from 'vue'

export function useMouse(container) {
    const mouse = reactive({
        x: 0,
        y: 0,
    })

    const updateMousePosition = (event) => {
        const rect = container.getBoundingClientRect()

        mouse.x =
            ((event.clientX - rect.left) / rect.width) * 2 - 1

        mouse.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    container.addEventListener(
        'mousemove',
        updateMousePosition
    )

    const destroy = () => {
        container.removeEventListener(
            'mousemove',
            updateMousePosition
        )
    }

    return {
        mouse,
        destroy,
    }
}