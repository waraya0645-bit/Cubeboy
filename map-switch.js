// ================================
// マップ切り替え
// ================================

function switchMap(scene, mapId, spawnX, spawnY, tileSize = 64) {

    // 同じマップへの切り替えは行わない
    if (scene.currentMapId === mapId) return;

    // 現在のマップ表示を消す
    clearMapLayers(scene);

    // 現在のオブジェクトを消す
    clearObjects(scene);

    // 新しいマップのデータを読み込む
    setupMapData(scene, mapId);

    // 新しいマップを描画する
    drawMapLayers(scene, tileSize);

    // 新しいマップのオブジェクトを設定して描画
    setupObjectsData(scene, mapId);
    drawObjects(scene, tileSize);

    // プレイヤーの配置先
    const x = spawnX * tileSize + tileSize / 2;
    const y = spawnY * tileSize + tileSize / 2
        + scene.mapOffsetY;

    scene.playerBody.x = x;
    scene.playerBody.y = y;

    // カメラを新しい位置に合わせる
    scene.cameras.main.centerOn(x, y);

    // 現在のマップを記録
    scene.currentMapId = mapId;

    // 移動前のタイル情報をリセット
    scene.lastEventTileKey = null;
}
