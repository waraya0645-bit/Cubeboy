// ================================
// ジョイスティックの初期化
// ================================

function setupJoystick(scene) {
    scene.stickX = scene.scale.width / 6;
    scene.stickY = scene.scale.height * 3 / 4;

    // 白い円
    scene.whiteCircle = scene.add.image(
        scene.stickX,
        scene.stickY,
        'whiteCircle'
    );

    scene.whiteCircle.setScrollFactor(0);

    // 黒い円
    scene.blackCircle = scene.add.image(
        scene.stickX,
        scene.stickY,
        'blackCircle'
    );

    scene.blackCircle.setScrollFactor(0);

    scene.whiteCircle.setAlpha(0.5);
    scene.blackCircle.setAlpha(0.5);

    // スティックを最前面に表示
    scene.whiteCircle.setDepth(10000);
    scene.blackCircle.setDepth(10001);

    // 指を押しているか
    scene.isDragging = false;

    // プレイヤー速度
    scene.speed = 300;

    // ================================
    // 指を動かしているとき
    // ================================

    scene.input.on('pointermove', (pointer) => {
        if (!scene.isDragging) {
            return;
        }

        const dx = pointer.x - scene.stickX;
        const dy = pointer.y - scene.stickY;

        const distance = Math.sqrt(dx * dx + dy * dy);

        // 黒い円が動ける最大距離
        const maxDistance = 30;

        // 白い円の外へ出ないようにする
        if (distance > maxDistance) {
            const angle = Math.atan2(dy, dx);

            scene.blackCircle.x =
                scene.stickX + Math.cos(angle) * maxDistance;

            scene.blackCircle.y =
                scene.stickY + Math.sin(angle) * maxDistance;
        } else {
            scene.blackCircle.x = pointer.x;
            scene.blackCircle.y = pointer.y;
        }
    });

    // ================================
    // 指を離したとき
    // ================================

    scene.input.on('pointerup', () => {
        scene.isDragging = false;

        // 黒い円を中央へ戻す
        scene.blackCircle.x = scene.stickX;
        scene.blackCircle.y = scene.stickY;
    });
}

// ================================
// ジョイスティックをタップしたとき
// ================================

function handleJoystickPointerDown(scene, pointer) {
    // 左半分以外なら処理しない
    if (pointer.x >= scene.scale.width / 2) {
        return false;
    }

    // スティックをタップした場所へ移動
    scene.stickX = pointer.x;
    scene.stickY = pointer.y;

    scene.whiteCircle.x = scene.stickX;
    scene.whiteCircle.y = scene.stickY;

    // 黒い円を中央に戻す
    scene.blackCircle.x = scene.stickX;
    scene.blackCircle.y = scene.stickY;

    scene.isDragging = true;

    return true;
}
