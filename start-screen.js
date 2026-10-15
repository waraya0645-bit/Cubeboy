// ================================
// START画面の設定
// ================================

function setupStartScreen(scene) {
    scene.startText = scene.add.text(
        scene.scale.width / 2,
        scene.scale.height / 2,
        'START',
        {
            fontSize: '48px',
            color: '#ffffff',
            backgroundColor: '#333333',
            padding: {
                x: 30,
                y: 15
            }
        }
    );

    scene.startText.setOrigin(0.5);
    scene.startText.setInteractive();

    // ボタン上で押し始めたか
    let startButtonPressed = false;

    scene.startText.on('pointerdown', () => {
        startButtonPressed = true;
    });

    // ボタンから指が外れたらキャンセル
    scene.startText.on('pointerout', () => {
        startButtonPressed = false;
    });

    // 指を離したときにゲーム開始
    scene.startText.on('pointerup', () => {
        if (!startButtonPressed) return;

        startButtonPressed = false;

        scene.gameStarted = true;

        const roomWidth = 18 * 64;
        const roomHeight = 10 * 64;

        // プレイヤーがいる部屋を記録
        scene.currentRoomX = Math.floor(
            scene.playerBody.x / roomWidth
        );

        scene.currentRoomY = Math.floor(
            (scene.playerBody.y - scene.mapOffsetY) / roomHeight
        );

        // カメラをプレイヤーの位置に合わせる
        scene.cameras.main.centerOn(
            scene.playerBody.x,
            scene.playerBody.y
        );

        scene.startText.destroy();
    });
}
