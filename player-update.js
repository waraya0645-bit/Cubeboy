function updatePlayer(time, delta) {
    if (!this.gameStarted) {
        return;
    }

    if (!this.isDragging) {
        return;
    }

    console.log("delta:", delta);

    this.debugText.setText('delta: ' + delta.toFixed(2));

    let dx = this.blackCircle.x - this.stickX;
    let dy = this.blackCircle.y - this.stickY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
        return;
    }

    const angle = Math.atan2(dy, dx);
// 画像切り替え用の角度（0～360度）
// 上を90度、左を180度、下を270度として扱う
const directionDegrees =
    (Math.atan2(-dy, dx) * 180 / Math.PI + 360) % 360;

let textureKey;

if (directionDegrees >= 60 && directionDegrees < 120) {
    textureKey = 'back_cube';       // 上
} else if (directionDegrees >= 120 && directionDegrees < 240) {
    textureKey = 'left_cube';       // 左
} else if (directionDegrees >= 240 && directionDegrees < 300) {
    textureKey = 'front_cube';      // 下
} else {
    textureKey = 'right_cube';      // 右
}

// 画像が変わるときだけ切り替える
if (this.player.texture.key !== textureKey) {
    this.player.setTexture(textureKey);
}
    const moveAmount = this.speed * (delta / 1000);

    // ================================
    // サイズ
    // ================================

    const halfSize = 28;
    const visualHalfSize = 32;
    const visualOffset = 4;

    const isColliding = (x, y) =>
    checkPlayerCollision(this, x, y, halfSize);
    
    // ================================
    // X方向へ移動
    // ================================

    const nextX =
        this.playerBody.x +
        Math.cos(angle) * moveAmount;

    const hitX =
        isColliding(nextX, this.playerBody.y);

    if (!hitX.hit) {

        this.playerBody.x = nextX;

    } else {

        if (dx > 0) {

            this.playerBody.x =
                hitX.left - halfSize;

        } else if (dx < 0) {

            this.playerBody.x =
                hitX.right + halfSize;
        }
    }


    // ================================
    // Y方向へ移動
    // ================================

    const nextY =
        this.playerBody.y +
        Math.sin(angle) * moveAmount;

    const hitY =
        isColliding(this.playerBody.x, nextY);

    if (!hitY.hit) {

        this.playerBody.y = nextY;

    } else {

        if (dy > 0) {

            this.playerBody.y =
                hitY.top - halfSize;

        } else if (dy < 0) {

            this.playerBody.y =
                hitY.bottom + halfSize;
        }
    }


    // ================================
    // 1タイル幅の道への吸着
    // ================================

    const tileX =
        Math.floor(this.playerBody.x / 64);

    const tileY =
    Math.floor(
        (this.playerBody.y - this.mapOffsetY) / 64
    );

    const currentRow = this.layers.wallCollision[tileY];
    if (currentRow) {
    const upperWall = this.layers.wallCollision[tileY - 1]?.[tileX] === 1;
    const lowerWall = this.layers.wallCollision[tileY + 1]?.[tileX] === 1;
        const centerY =
            tileY * 64 + 32 + this.mapOffsetY;

        // 上下が壁で挟まれた1タイル幅の道
        if (
            upperWall &&
            lowerWall &&
            !hitY.hit
        ) {

            this.playerBody.y +=
                (centerY - this.playerBody.y) * 1;
        }
    }
// ================================
    // 見た目の画像
    // ================================

    let offsetX = 0;
    let offsetY = 0;

    const bodyLeft = this.playerBody.x - halfSize;
    const bodyRight = this.playerBody.x + halfSize;
    const bodyTop = this.playerBody.y - halfSize;
    const bodyBottom = this.playerBody.y + halfSize;

    // --------------------------------
    // 近くの壁だけ調べる
    // --------------------------------

for (
    let row = 0;
    row < this.layers.wallCollision.length;
    row++
) {
    for (
        let col = 0;
        col < this.layers.wallCollision[row].length;
        col++
    ) {
        // この下は今までの壁の見た目補正処理を残す
        if (!this.layers.wallCollision[row][col]) {
            continue;
        }
            const wallLeft = col * 64;
            const wallRight = wallLeft + 64;
            const wallTop = row * 64 + this.mapOffsetY;
            const wallBottom = row * 64 + 64 + this.mapOffsetY;

            // ============================
            // 左側の壁
            // ============================

            const leftGap =
                wallLeft - bodyRight;

            if (
                leftGap >= 0 &&
                leftGap < visualOffset &&
                bodyBottom > wallTop &&
                bodyTop < wallBottom
            ) {

                offsetX =
                    Math.min(
                        offsetX,
                        -(visualOffset - leftGap)
                    );
            }

            // ============================
            // 右側の壁
            // ============================

            const rightGap =
                bodyLeft - wallRight;

            if (
                rightGap >= 0 &&
                rightGap < visualOffset &&
                bodyBottom > wallTop &&
                bodyTop < wallBottom
            ) {

                offsetX =
                    Math.max(
                        offsetX,
                        visualOffset - rightGap
                    );
            }

            // ============================
            // 上側の壁
            // ============================

            const topGap =
                wallTop - bodyBottom;

            if (
                topGap >= 0 &&
                topGap < visualOffset &&
                bodyRight > wallLeft &&
                bodyLeft < wallRight
            ) {

                offsetY =
                    Math.min(
                        offsetY,
                        -(visualOffset - topGap)
                    );
            }

            // ============================
            // 下側の壁
            // ============================

            const bottomGap =
                bodyTop - wallBottom;

            if (
                bottomGap >= 0 &&
                bottomGap < visualOffset &&
                bodyRight > wallLeft &&
                bodyLeft < wallRight
            ) {

                offsetY =
                    Math.max(
                        offsetY,
                        visualOffset - bottomGap
                    );
            }
        }
    }

// ================================
// 装飾物との見た目の補正
// ================================

for (const obj of this.layers.decorationCollision) {
    const objectLeft =
        obj.x - obj.width / 2;

    const objectRight =
        obj.x + obj.width / 2;

    const objectTop =
        obj.y - obj.height / 2;

    const objectBottom =
        obj.y + obj.height / 2;

    // 左側の装飾物
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

    // 右側の装飾物
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

    // 上側の装飾物
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

    // 下側の装飾物
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
// オブジェクトとの見た目の補正
// ================================

for (const obj of this.objects) {

    // オブジェクトの当たり判定の中心
    const objectX =
        obj.tileX * 64 + 32;

    const objectY =
        obj.tileY * 64 + 32 + this.mapOffsetY;

    // 当たり判定の四辺
    const objectLeft =
        objectX - obj.hitboxWidth / 2;

    const objectRight =
        objectX + obj.hitboxWidth / 2;

    const objectTop =
        objectY - obj.hitboxHeight / 2;

    const objectBottom =
        objectY + obj.hitboxHeight / 2;


    // ================================
    // 左側のオブジェクト
    // ================================

    const leftGap =
        objectLeft - bodyRight;

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


    // ================================
    // 右側のオブジェクト
    // ================================

    const rightGap =
        bodyLeft - objectRight;

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


    // ================================
    // 上側のオブジェクト
    // ================================

    const topGap =
        objectTop - bodyBottom;

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


    // ================================
    // 下側のオブジェクト
    // ================================

    const bottomGap =
        bodyTop - objectBottom;

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
    // プレイヤー画像を表示
    // ================================

    this.player.x =
        this.playerBody.x + offsetX;

    this.player.y =
        this.playerBody.y + offsetY;
    
updateCameraAndDepth(this);
}
