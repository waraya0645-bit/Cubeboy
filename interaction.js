// ================================
// オブジェクトとのインタラクト
// ================================

function handleInteraction(scene) {

    // STARTを押す前はインタラクトしない
    if (!scene.gameStarted) {
        return;
    }

    // プレイヤーの現在位置
    const playerX = scene.playerBody.x;
    const playerY = scene.playerBody.y;

    // プレイヤーの当たり判定
    const halfSize = 28;

    const playerLeft = playerX - halfSize;
    const playerRight = playerX + halfSize;
    const playerTop = playerY - halfSize;
    const playerBottom = playerY + halfSize;

    // 現在向いている方向
    const facing = scene.player.texture.key;

    // 最も近いインタラクト対象
    let targetObject = null;
    let nearestGap = Infinity;

    // オブジェクトを順番に調べる
    for (const obj of scene.objects) {

        if (!obj.interactable) {
            continue;
        }

        // オブジェクトの当たり判定の中心
        const objectX = obj.tileX * 64 + 32;

        const objectY =
            obj.tileY * 64 + 32 + scene.mapOffsetY;

        // オブジェクトの当たり判定の四辺
        const objectLeft =
            objectX - obj.hitboxWidth / 2;

        const objectRight =
            objectX + obj.hitboxWidth / 2;

        const objectTop =
            objectY - obj.hitboxHeight / 2;

        const objectBottom =
            objectY + obj.hitboxHeight / 2;

        let aligned = false;
        let gap = Infinity;

        // 上を向いている場合
        if (facing === 'back_cube') {

            aligned =
                objectY < playerY &&
                playerRight > objectLeft &&
                playerLeft < objectRight;

            gap = playerTop - objectBottom;
        }

        // 下を向いている場合
        else if (facing === 'front_cube') {

            aligned =
                objectY > playerY &&
                playerRight > objectLeft &&
                playerLeft < objectRight;

            gap = objectTop - playerBottom;
        }

        // 左を向いている場合
        else if (facing === 'left_cube') {

            aligned =
                objectX < playerX &&
                playerBottom > objectTop &&
                playerTop < objectBottom;

            gap = playerLeft - objectRight;
        }

        // 右を向いている場合
        else if (facing === 'right_cube') {

            aligned =
                objectX > playerX &&
                playerBottom > objectTop &&
                playerTop < objectBottom;

            gap = objectLeft - playerRight;
        }

        // 前方にあり、十分近いオブジェクトだけを対象にする
        if (
            aligned &&
            gap >= -4 &&
            gap <= 16 &&
            Math.abs(gap) < nearestGap
        ) {
            targetObject = obj;
            nearestGap = Math.abs(gap);
        }
    }

    // インタラクトの実行
    if (targetObject !== null) {

        const handler =
            scene.interactionHandlers[
                targetObject.interactionType
            ];

        if (handler) {
            handler(targetObject);
        } else {
            scene.interactionText.setText(
                '未定義のinteractionType: ' +
                targetObject.interactionType
            );
        }
        } else {
        // オブジェクトがなければタイルイベントを確認
        if (handleTileEventInteraction(scene, 64)) {
            return;
        }

        scene.interactionText.setText(
            '対象なし：前方に近づいてください'
        );
    }
}
