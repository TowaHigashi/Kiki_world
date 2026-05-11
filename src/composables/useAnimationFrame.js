// requestAnimationFrame管理。今後はcontrols.update()、mixer.update()、floating animationなども

export function useAnimationFrame(callback) {
    let animationId = null

    const animate = () => {
        animationId = requestAnimationFrame(animate)

        callback()
    }

    const start = () => {
        animate()
    }

    const stop = () => {
        if (animationId) {
            cancelAnimationFrame(animationId)
        }
    }

    return {
        start,
        stop,
    }
}