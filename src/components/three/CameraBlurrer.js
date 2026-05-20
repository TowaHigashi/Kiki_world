import { watch } from 'vue'

export function useCameraBlurrer({ container, sceneStore }) {
    if (!container) return { destroy: () => { } }

    // 少しずつ変化させるため、CSSのtransitionを設定
    container.style.transition = 'filter 0.5s ease-in-out'

    // sceneStore.isModalOpenの変更を監視
    const unwatch = watch(
        () => sceneStore.isModalOpen,
        (isOpen) => {
            if (isOpen) {
                // trueになったら：視界を少しグレーにする
                container.style.filter = 'grayscale(0.8)'
            } else {
                // falseになったら：元に戻す
                container.style.filter = 'grayscale(0)'
            }
        },
        { immediate: true } // 初期状態も反映
    )

    return {
        destroy: () => {
            unwatch()
            if (container) {
                container.style.filter = ''
                container.style.transition = ''
            }
        }
    }
}

// どうしてもblurを入れたい場合は、CSSではなく Three.jsネイティブの「ポストプロセッシング（EffectComposer）」を使うといい（導入がめんどい）