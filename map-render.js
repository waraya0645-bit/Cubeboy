// ================================
// マップの描画処理
// ================================

function drawMapLayers(scene, tileSize) {

    // ================================
    // 1. 床の見た目を描画
    // ================================

    for (let y = 0; y < scene.floorMapData.length; y++) {
        for (let x = 0; x < scene.floorMapData[y].length; x++) {
            const tile = scene.floorMapData[y][x];

            // nullなら何も描画しない
            if (tile === null) {
                continue;
            }

            const floorImage = scene.add.image(
                x * tileSize + 32,
                y * tileSize + 32 + scene.mapOffsetY,
                String(tile)
            );

            scene.layers.floor.push(floorImage);
        }
    }

    // ================================
    // 2. 壁の当たり判定レイヤー
    // ================================

    scene.layers.wallCollision =
        scene.wallCollisionMapData;


    // ================================
    // 3. 壁の見た目レイヤー
    // ================================

    for (
        let y = 0;
        y < scene.wallVisualMapData.length;
        y++
    ) {
        for (
            let x = 0;
            x < scene.wallVisualMapData[y].length;
            x++
        ) {
            const tile = scene.wallVisualMapData[y][x];

            // 0は透明、100以上は壁画像
            if (tile === 0) {
                continue;
            }

            const wall = scene.add.image(
                x * tileSize + 32,
                y * tileSize + scene.mapOffsetY,
                String(tile)
            );

            wall.footY =
                y * tileSize + 64 + scene.mapOffsetY;

            wall.setDepth(wall.footY);

            scene.layers.wallVisual.push(wall);
        }
    }

    // ================================
    // 4. 装飾の表示レイヤー
    // ================================

    for (let y = 0; y < scene.decorationVisualMapData.length; y++) {
        for (let x = 0; x < scene.decorationVisualMapData[y].length; x++) {
            const tile = scene.decorationVisualMapData[y][x];

            // 0は画像なし
            if (tile === 0) continue;

            const decorationImage = scene.add.image(
                x * tileSize + 32,
                y * tileSize + 32 + scene.mapOffsetY,
                String(tile)
            );

            scene.layers.decorationVisual.push(decorationImage);
        }
    }

    // ================================
    // 5. 装飾の当たり判定レイヤー
    // ================================

    for (let y = 0; y < scene.decorationCollisionMapData.length; y++) {
        for (let x = 0; x < scene.decorationCollisionMapData[y].length; x++) {
            const tile = scene.decorationCollisionMapData[y][x];

            // 1のマスだけ当たり判定を作る
            if (tile !== 1) continue;

            scene.layers.decorationCollision.push({
                tileX: x,
                tileY: y,
                x: x * tileSize + 32,
                y: y * tileSize + 32 + scene.mapOffsetY,
                width: tileSize,
                height: tileSize
            });
        }
    }
}

// ================================
// 現在のマップ表示を消す
// ================================

function clearMapLayers(scene) {

    // 床の画像を消す
    for (const image of scene.layers.floor) {
        image.destroy();
    }
    scene.layers.floor.length = 0;

    // 壁の画像を消す
    for (const image of scene.layers.wallVisual) {
        image.destroy();
    }
    scene.layers.wallVisual.length = 0;

    // 装飾物の画像を消す
    for (const image of scene.layers.decorationVisual) {
        image.destroy();
    }
    scene.layers.decorationVisual.length = 0;

    // 壁の当たり判定データを解除
    scene.layers.wallCollision = [];

    // 装飾の当たり判定データを消す
    scene.layers.decorationCollision.length = 0;
}
