function updatePlayer(time, delta) {
    if (!this.gameStarted) {
        return;
    }

    if (!this.isDragging) {
        return;
    }

    let dx = this.blackCircle.x - this.stickX;
    let dy = this.blackCircle.y - this.stickY;

    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
        return;
    }

    const angle = Math.atan2(dy, dx);
    
    updatePlayerDirection(this, dx, dy);
    
    const moveAmount = this.speed * (delta / 1000);

    // ================================
    // サイズ
    // ================================

    const halfSize = 28;
    const visualHalfSize = 32;
    const visualOffset = 4;

// ================================
// プレイヤー本体の移動
// ================================

movePlayerBody(
    this,
    dx,
    dy,
    angle,
    moveAmount,
    halfSize
);

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
