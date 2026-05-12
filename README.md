# Kiki_world
記記の紹介Webサイト

# ディレクトリ構成図

```txt
ThreeProject2/
├── public/　　　// staticファイル
│   ├── models/　　　// 3Dモデル
│   │   └── *.glb
│   ├── textures/　　// テクスチャ
│   │   └── *.jpg / *.png
│   ├── hdr/　　　　 // 環境マップ
│   │   └── *.hdr
│   └── vue.svg
│
├── src/
│   ├── components/
│   │   ├── three/　　// Three.js関連のコンポーネント ※1
│   │   ├── ui/　　　　　 // UIコンポーネント ※2
│   │   ├── objects/　　　// オブジェクトコンポーネント ※3
│   │   └── modal/　　　 // モーダルコンポーネント ※4   
│   │
│   ├── data/
│   │   ├── objects.js　　　// オブジェクトデータ(userData)管理  ※5
│   │   └── modalComponentMap.js　　　// モーダルコンポーネントマップ ※6
│   │
│   ├── stores/
│   │   └── sceneStore.js　　　// シーンの情報を管理する。Pinia使用 ※7
│   │
│   ├── composables/　　　// use関数 ※8
│   │   ├── useThreeScene.js
│   │   ├── useRenderer.js
│   │   ├── useCamera.js
│   │   ├── useRaycaster.js
│   │   ├── useResize.js
│   │   ├── useMouse.js
│   │   ├── useAnimationFrame.js
│   │   ├── useOrbitControls.js
│   │   ├── useLight.js
│   │   └── useStrollingDetection.js
│   │
│   ├── assets/　　　// UI用のの画像ファイルなどを管理するフォルダ
│   │   ├── styles/
│   │   └── images/
│   │
│   ├── views/
│   │   └── MainView.vue　　　// メイン画面となるcomponent。空間コンポーネントやサブモーダル、ボタンのUIなどを配置する場所。
│   │
│   ├── App.vue　　　// MainView.vueを配置する場所。基本的には触らない。
│   └── Main.js　　　// メイン処理。あまり触らない。
│
├── package.json
├── vite.config.js
├── ObjectNumbersStatic.txt
└── index.html
```

## 詳細

※1 Three.js関連のコンポーネント

- SceneCanvas.vue
  - Three.js全体の空間コンポーネント。（components/objects/のコンポーネントを配置する場所を提供する）
  - シーンの初期化、ライトの追加、アニメーションループの開始などを行う。
  - ここで書くものはなるべく短くする。

- InteractionManager.js
  - マウスカーソルの動きを検知し、シーン内のオブジェクトを検出する。
  - オブジェクトにマウスカーソルが重なっているかをチェックし、その結果をsceneStoreに保存する。

- CameraController.js
  - カメラ移動の制御。sceneStoreと連携してターゲット位置を更新する。

※2 UIコンポーネント（バックボタンなどの状態管理コンポーネントを管理）

- BackButton1.vue

- BackButton2.vue

- SoundOnOffButton.vue

※3 オブジェクトコンポーネント（3Dモデルのコンポーネントのオブジェクト生成を行う）

- src/components/objects/README.md参照。

※4 モーダルコンポーネント（サブコンポーネントUIを管理）

- src/components/modal/README.md参照。

※5 メタデータ(userData: オブジェクト定義、静的設定など)をJSONで管理

- src/data/README.md参照。
　ドライブ上の「メタデータ一覧」のほうが見やすいかも

※6 モーダルコンポーネントマップ

- MainView.vue側に変数を用意しておいて、sceneStoreを監視して対応するparamを返してあげることで、対象の画面を表示させる。
　そのparam置き場。MainView.vueの変数を用意する。

※7 シーンの情報を管理する。Pinia使用

- src/stores/README.md参照。

※8 use関数

- useAnimationFrame.js
  - アニメーションループを管理する。requestAnimationFrameを使用して、指定されたコールバック関数を繰り返し呼び出す。
  - アニメーションの停止・再開も可能。

- useCamera.js
  - カメラの設定（FOV, Near, Farなど）を管理し、ウィンドウリサイズ時にカメラのプロジェクション行列を更新する。
  - シーンのスケール変更に対応するための関数も提供する。

- useLight.js
  - シーン内のライトを管理する。
  - 環境光、点光源、スポットライトの追加と、それらの位置・色の設定を行う。

- useMouse.js
  - マウスの動きを検知し、その位置をポーリングする。
  - マウスの現在位置、前回の位置、移動量を保持する。

- useOrbitControls.js
  - OrbitControlsを初期化し、マウス操作でカメラを制御できるようにする。
  - マウスホイールによるズームや、ドラッグによる回転・移動を可能にする。

- useRaycaster.js
  - レイキャスティングをセットアップし、マウスカーソルの位置からシーン内のオブジェクトを検出する。
  - マウスがobjectsのリスト内のいずれかのオブジェクトに重なっているかをチェックする。

- useResize.js
  - ウィンドウのリサイズイベントを検知し、Three.jsのレンダーターゲットとカメラのアスペクト比を更新する。
  - レスポンシブなレイアウトを実現する。

- useStrollingDetection.js
  - シーンのカメラの位置を少しずつ動かし、モデルが歩いているような視覚効果を生み出す。
  - カメラのターゲット位置を円周上に移動させることで、被写体を回るような動きを実現する。

- useThreeScene.js
  - Three.jsのシーンを初期化し、レンダーターゲットとレイキャスターを設定する。
  - シーンへのオブジェクトの追加やライトの追加、アニメーションループの開始も行う。

- useRenderer.js
  - Three.jsのWebGLRendererを初期化し、レンダーターゲットとカメラを設定する。
  - シーンとカメラを渡すと、レンダーターゲットのサイズに合わせて設定を更新する。
