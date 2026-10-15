function drawObjects(scene, tileSize) {
    scene.objects.forEach((obj) => {
        const objectImage = scene.add.image(
            obj.tileX * tileSize + tileSize / 2,
            obj.tileY * tileSize + tileSize / 2 + scene.mapOffsetY,
            obj.image
        );

        objectImage.setDepth(
            obj.tileY * tileSize + tileSize / 2 + scene.mapOffsetY
        );

        if (obj.visible === false) {
            objectImage.setVisible(false);
        }

        obj.sprite = objectImage;
    });
}

// ================================
// オブジェクトの表示を消す
// ================================

function clearObjects(scene) {
    for (const obj of scene.objects) {
        if (obj.sprite) {
            obj.sprite.destroy();
            obj.sprite = null;
        }
    }

    scene.objects = [];
}
