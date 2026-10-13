// ================================
// プレイヤーの当たり判定
// ================================

function checkPlayerCollision(scene, x, y, halfSize) {
    const left = x - halfSize;
    const right = x + halfSize;
    const top = y - halfSize;
    const bottom = y + halfSize;

    // ================================
    // 1. 壁の当たり判定
    // ================================

    for (
        let row = 0;
        row < scene.layers.wallCollision.length;
        row++
    ) {
        for (
            let col = 0;
            col < scene.layers.wallCollision[row].length;
            col++
        ) {
            if (!scene.layers.wallCollision[row][col]) {
                continue;
            }

            const wallLeft = col * 64;
            const wallRight = wallLeft + 64;
            const wallTop =
                row * 64 + scene.mapOffsetY;
            const wallBottom = wallTop + 64;

            if (
                right > wallLeft &&
                left < wallRight &&
                bottom > wallTop &&
                top < wallBottom
            ) {
                return {
                    hit: true,
                    left: wallLeft,
                    right: wallRight,
                    top: wallTop,
                    bottom: wallBottom
                };
            }
        }
    }

    // ================================
    // 2. 装飾物の当たり判定
    // ================================

    for (const object of scene.layers.decorationCollision) {
        const objectLeft =
            object.x - object.width / 2;
        const objectRight =
            object.x + object.width / 2;
        const objectTop =
            object.y - object.height / 2;
        const objectBottom =
            object.y + object.height / 2;

        if (
            right > objectLeft &&
            left < objectRight &&
            bottom > objectTop &&
            top < objectBottom
        ) {
            return {
                hit: true,
                left: objectLeft,
                right: objectRight,
                top: objectTop,
                bottom: objectBottom
            };
        }
    }

    // ================================
    // 3. オブジェクトの当たり判定
    // ================================

    for (const obj of scene.objects) {
        if (obj.collidable === false) {
            continue;
        }

        // オブジェクトの中心座標
        const objectX =
            obj.tileX * 64 + 32;
        const objectY =
            obj.tileY * 64 + 32 + scene.mapOffsetY;

        // 当たり判定の大きさ
        const objectHalfWidth =
            obj.hitboxWidth / 2;
        const objectHalfHeight =
            obj.hitboxHeight / 2;

        // オブジェクトの四辺
        const objectLeft =
            objectX - objectHalfWidth;
        const objectRight =
            objectX + objectHalfWidth;
        const objectTop =
            objectY - objectHalfHeight;
        const objectBottom =
            objectY + objectHalfHeight;

        // プレイヤーと重なっているか
        if (
            right > objectLeft &&
            left < objectRight &&
            bottom > objectTop &&
            top < objectBottom
        ) {
            return {
                hit: true,
                left: objectLeft,
                right: objectRight,
                top: objectTop,
                bottom: objectBottom
            };
        }
    }

    // 何にも衝突していない
    return {
        hit: false
    };
}
