// ================================
// マップBのデータ
// ================================

function setupMapBData(scene) {
const width = 18;
const height = 10;

// 1. 床の見た目
scene.floorMapData = [
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
[0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0],
[0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0],
[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

    // 2. 壁の当たり判定
    scene.wallCollisionMapData = Array.from(
        { length: height },
        () => Array(width).fill(0)
    );

    // 3. 壁の見た目
    scene.wallVisualMapData = Array.from(
        { length: height },
        () => Array(width).fill(0)
    );

    // 4. 装飾物の当たり判定
    scene.decorationCollisionMapData = Array.from(
        { length: height },
        () => Array(width).fill(0)
    );

    // 5. 装飾物の見た目
    scene.decorationVisualMapData = Array.from(
        { length: height },
        () => Array(width).fill(0)
    );

    // 6. タイルイベント
    scene.eventMapData = Array.from(
        { length: height },
        () => Array(width).fill(0)
    );
}
