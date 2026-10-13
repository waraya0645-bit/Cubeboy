// ================================
// プレイヤー画像の位置補正
// ================================

function calculatePlayerVisualOffset(scene, halfSize, visualOffset) {
    let offsetX = 0;
    let offsetY = 0;

    const bodyLeft = scene.playerBody.x - halfSize;
    const bodyRight = scene.playerBody.x + halfSize;
    const bodyTop = scene.playerBody.y - halfSize;
    const bodyBottom = scene.playerBody.y + halfSize;

    // ================================
    // 1. 壁との見た目の補正
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
            const wallTop = row * 64 + scene.mapOffsetY;
            const wallBottom = row * 64 + 64 + scene.mapOffsetY;

            // 左側の壁
            const leftGap = wallLeft - bodyRight;

            if (
                leftGap >= 0 &&
                leftGap < visualOffset &&
                bodyBottom > wallTop &&
                bodyTop < wallBottom
            ) {
                offsetX = Math.min(
                    offsetX,
                    -(visualOffset - leftGap)
                );
            }

            // 右側の壁
            const rightGap = bodyLeft - wallRight;

            if (
                rightGap >= 0 &&
                rightGap < visualOffset &&
                bodyBottom > wallTop &&
                bodyTop < wallBottom
            ) {
                offsetX = Math.max(
                    offsetX,
                    visualOffset - rightGap
                );
            }

            // 上側の壁
            const topGap = wallTop - bodyBottom;

            if (
                topGap >= 0 &&
                topGap < visualOffset &&
                bodyRight > wallLeft &&
                bodyLeft < wallRight
            ) {
                offsetY = Math.min(
                    offsetY,
                    -(visualOffset - topGap)
                );
            }

            // 下側の壁
            const bottomGap = bodyTop - wallBottom;

            if (
                bottomGap >= 0 &&
                bottomGap < visualOffset &&
                bodyRight > wallLeft &&
                bodyLeft < wallRight
            ) {
                offsetY = Math.max(
                    offsetY,
                    visualOffset - bottomGap
                );
            }
        }
    }

    // ================================
    // 2. 装飾物との見た目の補正
    // ================================

    for (const obj of scene.layers.decorationCollision) {
        const objectLeft = obj.x - obj.width / 2;
        const objectRight = obj.x + obj.width / 2;
        const objectTop = obj.y - obj.height / 2;
        const objectBottom = obj.y + obj.height / 2;

        // 左側
        const leftGap = objectLeft - bodyRight;

        if (
            leftGap >= 0 &&
            leftGap < visualOffset &&
            bodyBottom > objectTop &&
            bodyTop < objectBottom
        ) {
            offsetX = Math.min(
                offsetX,
                -(visualOffset - leftGap)
            );
        }

        // 右側
        const rightGap = bodyLeft - objectRight;

        if (
            rightGap >= 0 &&
            rightGap < visualOffset &&
            bodyBottom > objectTop &&
            bodyTop < objectBottom
        ) {
            offsetX = Math.max(
                offsetX,
                visualOffset - rightGap
            );
        }

        // 上側
        const topGap = objectTop - bodyBottom;

        if (
            topGap >= 0 &&
            topGap < visualOffset &&
            bodyRight > objectLeft &&
            bodyLeft < objectRight
        ) {
            offsetY = Math.min(
                offsetY,
                -(visualOffset - topGap)
            );
        }

        // 下側
        const bottomGap = bodyTop - objectBottom;

        if (
            bottomGap >= 0 &&
            bottomGap < visualOffset &&
            bodyRight > objectLeft &&
            bodyLeft < objectRight
        ) {
            offsetY = Math.max(
                offsetY,
                visualOffset - bottomGap
            );
        }
    }

    // ================================
    // 3. オブジェクトとの見た目の補正
    // ================================

    for (const obj of scene.objects) {
        const objectX = obj.tileX * 64 + 32;
        const objectY =
            obj.tileY * 64 + 32 + scene.mapOffsetY;

        const objectLeft = objectX - obj.hitboxWidth / 2;
        const objectRight = objectX + obj.hitboxWidth / 2;
        const objectTop = objectY - obj.hitboxHeight / 2;
        const objectBottom = objectY + obj.hitboxHeight / 2;

        // 左側
        const leftGap = objectLeft - bodyRight;

        if (
            leftGap >= 0 &&
            leftGap < visualOffset &&
            bodyBottom > objectTop &&
            bodyTop < objectBottom
        ) {
            offsetX = Math.min(
                offsetX,
                -(visualOffset - leftGap)
            );
        }

        // 右側
        const rightGap = bodyLeft - objectRight;

        if (
            rightGap >= 0 &&
            rightGap < visualOffset &&
            bodyBottom > objectTop &&
            bodyTop < objectBottom
        ) {
            offsetX = Math.max(
                offsetX,
                visualOffset - rightGap
            );
        }

        // 上側
        const topGap = objectTop - bodyBottom;

        if (
            topGap >= 0 &&
            topGap < visualOffset &&
            bodyRight > objectLeft &&
            bodyLeft < objectRight
        ) {
            offsetY = Math.min(
                offsetY,
                -(visualOffset - topGap)
            );
        }

        // 下側
        const bottomGap = bodyTop - objectBottom;

        if (
            bottomGap >= 0 &&
            bottomGap < visualOffset &&
            bodyRight > objectLeft &&
            bodyLeft < objectRight
        ) {
            offsetY = Math.max(
                offsetY,
                visualOffset - bottomGap
            );
        }
    }

    return { offsetX, offsetY };
}
