// ================================
// プレイヤー本体の移動
// ================================

function movePlayerBody(
    scene,
    dx,
    dy,
    angle,
    moveAmount,
    halfSize
) {
    // ================================
    // X方向へ移動
    // ================================

    const nextX =
        scene.playerBody.x +
        Math.cos(angle) * moveAmount;

    const hitX = checkPlayerCollision(
        scene,
        nextX,
        scene.playerBody.y,
        halfSize
    );

    if (!hitX.hit) {
        scene.playerBody.x = nextX;
    } else {
        if (dx > 0) {
            scene.playerBody.x =
                hitX.left - halfSize;
        } else if (dx < 0) {
            scene.playerBody.x =
                hitX.right + halfSize;
        }
    }

    // ================================
    // Y方向へ移動
    // ================================

    const nextY =
        scene.playerBody.y +
        Math.sin(angle) * moveAmount;

    const hitY = checkPlayerCollision(
        scene,
        scene.playerBody.x,
        nextY,
        halfSize
    );

    if (!hitY.hit) {
        scene.playerBody.y = nextY;
    } else {
        if (dy > 0) {
            scene.playerBody.y =
                hitY.top - halfSize;
        } else if (dy < 0) {
            scene.playerBody.y =
                hitY.bottom + halfSize;
        }
    }

    // ================================
    // 1タイル幅の道への吸着
    // ================================

    const tileX =
        Math.floor(scene.playerBody.x / 64);

    const tileY = Math.floor(
        (scene.playerBody.y - scene.mapOffsetY) / 64
    );

    const currentRow =
        scene.layers.wallCollision[tileY];

    if (currentRow) {
        const upperWall =
            scene.layers.wallCollision[tileY - 1]?.[tileX] === 1;

        const lowerWall =
            scene.layers.wallCollision[tileY + 1]?.[tileX] === 1;

        const centerY =
            tileY * 64 + 32 + scene.mapOffsetY;

        // 上下が壁で挟まれた1タイル幅の道
        if (
            upperWall &&
            lowerWall &&
            !hitY.hit
        ) {
            scene.playerBody.y +=
                (centerY - scene.playerBody.y) * 1;
        }
    }
}
