import { watch } from 'vue'

export function useCameraBlurrer({ container, sceneStore }) {
    if (!container) return { destroy: () => { } }

    const canvas = container.querySelector('canvas')
    const targetElement = canvas || container

    // 少しずつ変化させるため、CSSのtransitionを設定
    targetElement.style.transition = 'filter 0.5s ease-in-out'

    // sceneStore.isModalOpenの変更を監視
    const unwatch = watch(
        () => sceneStore.isModalOpen,
        (isOpen) => {
            if (isOpen) {
                // trueになったら：視界を少しグレーにする
                targetElement.style.filter = 'grayscale(0.8)'
            } else {
                // falseになったら：元に戻す
                targetElement.style.filter = 'grayscale(0)'
            }
        },
        { immediate: true } // 初期状態も反映
    )

    return {
        destroy: () => {
            unwatch()
            if (targetElement) {
                targetElement.style.filter = ''
                targetElement.style.transition = ''
            }
        }
    }
}

// どうしてもblurを入れたい場合は、CSSではなく Three.jsネイティブの「ポストプロセッシング（EffectComposer）」を使うといい（導入がめんどい）