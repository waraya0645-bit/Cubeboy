
function setupPlayer(scene, tileSize) {
    // プレイヤーの初期位置（タイル座標）
    const playerStartTileX = 27;
    const playerStartTileY = 3;

    const playerStartX =
        playerStartTileX * tileSize + tileSize / 2;

    const playerStartY =
        playerStartTileY * tileSize + tileSize / 2 + scene.mapOffsetY;

    const player = scene.add.image(
        playerStartX,
        playerStartY,
        'front_cube'
    );

    scene.player = player;

    scene.playerBody = {
        x: playerStartX,
        y: playerStartY
    };

    scene.currentRoomX = 0;
    scene.currentRoomY = 0;
}
