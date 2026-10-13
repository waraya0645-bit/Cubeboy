// ================================
// カメラ切り替えと描画順
// ================================

function updateCameraAndDepth(scene) {

    // ================================
    // 部屋ごとのカメラ切り替え
    // ================================

    const roomWidth = 18 * 64;
    const roomHeight = 10 * 64;

    // プレイヤーがいる部屋の番号を求める
    const roomX = Math.floor(
        scene.playerBody.x / roomWidth
    );

    const roomY = Math.floor(
        (scene.playerBody.y - scene.mapOffsetY) / roomHeight
    );

    // 部屋が変わったときだけ、カメラを瞬時に移動
    if (
        roomX !== scene.currentRoomX ||
        roomY !== scene.currentRoomY
    ) {
        scene.currentRoomX = roomX;
        scene.currentRoomY = roomY;

        scene.cameras.main.setScroll(
            roomX * roomWidth,
            roomY * roomHeight
        );
    }

    // ================================
    // プレイヤーの描画順
    // ================================

    const playerFootY = scene.playerBody.y + 32;
    scene.player.setDepth(playerFootY + 1);

    // ================================
    // 壁の描画順
    // ================================

    for (const wall of scene.layers.wallVisual) {
        wall.setDepth(wall.footY);
    }

    // ================================
    // 装飾物の描画順
    // ================================

    for (const decoration of scene.layers.decorationVisual) {
        decoration.setDepth(
            decoration.y + decoration.displayHeight / 2
        );
    }
}
