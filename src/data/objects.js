// オブジェクト定義、静的設定をJSONで管理

export const Objects = [
    {
        type: 'config',
        fileName: '',
        path: '',
        position: [-6, 5, -7],
        rotation: '',
        scale: '',
        target: [0, 0, 0],
        name: 'カメラ初期位置',
        id: 1001,
        cameraFocusIn: {
            position: '',
            target: '',
        },
        cameraFocusOut: {
            position: '',
            target: '',
        }
    },
    {
        type: 'object',
        fileName: 'Object0-a.glb',
        path: '/models/Object0-a.glb',
        position: [0, 0, 0],
        rotation: [0, 0, 0],
        scale: [1.2, 1.2, 1.2],
        target: '',
        name: '試しオブジェクト1',
        id: 2001,
        cameraFocusIn: {
            position: '',
            target: '',
        },
        cameraFocusOut: {
            position: '',
            target: '',
        }
    },
    {
        type: 'object',
        fileName: 'Object0-b.glb',
        path: '/models/Object0-b.glb',
        position: [0.6, 1.03, 1],
        rotation: [0, -0.6, 1.35],
        scale: [0.08, 0.08, 0.08],
        target: '',
        name: '試しオブジェクト2',
        id: 2002,
        cameraFocusIn: {
            position: [-1.4, 1.8, 0.23],
            target: [0, 0.7, 1.2],
        },
        cameraFocusOut: {
            position: [-4.4, 4.1, -1.8],
            target: [0, 0.7, 1.2],
        }
    },
]