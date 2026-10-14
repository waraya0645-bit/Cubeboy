// ================================
// プレイヤーの向きと画像切り替え
// ================================

function updatePlayerDirection(scene, dx, dy) {
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
    if (scene.player.texture.key !== textureKey) {
        scene.player.setTexture(textureKey);
    }
}
