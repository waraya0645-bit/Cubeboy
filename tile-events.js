function runTileEvent(scene, tileSize, trigger) {
    const tileX = Math.floor(scene.playerBody.x / tileSize);
    const tileY = Math.floor(
        (scene.playerBody.y - scene.mapOffsetY) / tileSize
    );

    const eventId = scene.eventMapData?.[tileY]?.[tileX];

    // 0はイベントなし
    if (!eventId) return false;

    const definition = scene.tileEventDefinitions?.[eventId];
    if (!definition) return false;

    // 発生条件が一致する場合のみ実行
    if ((definition.trigger || 'step') !== trigger) {
        return false;
    }

    const handler =
        scene.interactionHandlers?.[definition.interactionType];

    if (typeof handler !== 'function') return false;

    // 一度だけ実行するイベントの管理
    if (!scene.triggeredTileEvents) {
        scene.triggeredTileEvents = new Set();
    }

    const tileKey = `${tileX},${tileY}`;

    if (definition.once) {
        if (scene.triggeredTileEvents.has(tileKey)) {
            return false;
        }

        scene.triggeredTileEvents.add(tileKey);
    }

    handler({
        ...definition,
        eventId,
        tileX,
        tileY
    });

    return true;
}

// タイルに入ったときの判定
function checkTileEvent(scene, tileSize) {
    const tileX = Math.floor(scene.playerBody.x / tileSize);
    const tileY = Math.floor(
        (scene.playerBody.y - scene.mapOffsetY) / tileSize
    );

    const tileKey = `${tileX},${tileY}`;

    if (tileKey === scene.lastEventTileKey) return;

    scene.lastEventTileKey = tileKey;

    runTileEvent(scene, tileSize, 'step');
}

// 乗っているタイルをインタラクトしたときの判定
function handleTileEventInteraction(scene, tileSize) {
    return runTileEvent(scene, tileSize, 'interact');
}
