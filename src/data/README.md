# メタデータ一覧

項目	内容	備考
type	objectかそれ以外か	別にプログラムでは使わないけど、今後オブジェクト以外を別のconfigに移すときのために
fileName	ファイル名.glb	
path	モデルパス	
初期位置	初期位置	
target	初期ターゲット	
name	名前1	分かりやすいやつ。プログラム上では使用しないがメタデータとして書いておく
id	名前2	userData.idに入れるやつ。object1-aとかの採番 数値で管理（config系は1xxx、object系は2xxx）
cameraFocusIn.position	オブジェクトズームイン時の座標	
cameraFocusIn.target	同上	
cameraFocusOut.position	オブジェクトズームアウト時の座標	
cameraFocusOut.target	同上	