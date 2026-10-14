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
// プレイヤー画像の位置補正
// ================================

const { offsetX, offsetY } =
    calculatePlayerVisualOffset(
        this,
        halfSize,
        visualOffset
    );
    // ================================
    // プレイヤー画像を表示
    // ================================

    this.player.x =
        this.playerBody.x + offsetX;

    this.player.y =
        this.playerBody.y + offsetY;
    
updateCameraAndDepth(this);
}
