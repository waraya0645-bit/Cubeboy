function checkTileEvent(scene, tileSize) {
    const tileX = Math.floor(
        scene.playerBody.x / tileSize
    );

    const tileY = Math.floor(
        (scene.playerBody.y - scene.mapOffsetY) / tileSize
    );

    const tileKey = `${tileX},${tileY}`;

    // 同じタイルにいる間は再実行しない
    if (tileKey === scene.lastEventTileKey) return;

    scene.lastEventTileKey = tileKey;

    // マップからイベント番号を取得
    const eventId = scene.eventMapData?.[tileY]?.[tileX];

    // 0はイベントなし
    if (!eventId) return;

    // 番号に対応する設定を取得
    const definition = scene.tileEventDefinitions?.[eventId];

    if (!definition) return;

    // interaction-handlers.js の処理を取得
    const handler =
        scene.interactionHandlers?.[definition.interactionType];

    if (typeof handler !== 'function') return;

    // イベント設定を処理に渡す
    handler({
        ...definition,
        eventId,
        tileX,
        tileY
    });
}
