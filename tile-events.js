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

    const eventId = scene.eventMapData?.[tileY]?.[tileX];

    // 0はイベントなし
    if (!eventId) return;

    const definition = scene.tileEventDefinitions?.[eventId];
    if (!definition) return;

    const handler =
        scene.interactionHandlers?.[definition.interactionType];

    if (typeof handler !== 'function') return;

    // 一度だけ実行するイベントの管理
    if (!scene.triggeredTileEvents) {
        scene.triggeredTileEvents = new Set();
    }

    if (definition.once) {
        if (scene.triggeredTileEvents.has(tileKey)) return;
        scene.triggeredTileEvents.add(tileKey);
    }

    handler({
        ...definition,
        eventId,
        tileX,
        tileY
    });
}
