function setupInput(scene) {
    const tapStarts = new Map();

    // タップと判定する条件
    const maxTapDuration = 300; // 最大300ミリ秒
    const maxMoveDistance = 12; // 移動距離は最大12ピクセル

    scene.input.on('pointerdown', (pointer) => {

        // STARTを押す前は入力を記録しない
        if (!scene.gameStarted) return;

        // ジョイスティック操作なら、タップ判定をしない
        if (handleJoystickPointerDown(scene, pointer)) {
            tapStarts.delete(pointer.id);
            return;
        }

        // 指を押した位置と時刻を記録
        tapStarts.set(pointer.id, {
            x: pointer.x,
            y: pointer.y,
            time: scene.time.now
        });
    });

    scene.input.on('pointerup', (pointer) => {

        const start = tapStarts.get(pointer.id);
        if (!start) return;

        // 今回の入力記録を削除
        tapStarts.delete(pointer.id);

        // 指が動いた距離
        const distance = Math.hypot(
            pointer.x - start.x,
            pointer.y - start.y
        );

        // 指を押していた時間
        const duration = scene.time.now - start.time;

        // 短いタップだけ実行
        if (
            distance <= maxMoveDistance &&
            duration <= maxTapDuration
        ) {
            handleInteraction(scene);
        }
    });

    // キャンバスの外で指を離したらキャンセル
    scene.input.on('pointerupoutside', (pointer) => {
        tapStarts.delete(pointer.id);
    });
}
