// ================================
// マップごとのオブジェクトデータ
// ================================

function getObjectsDataForMap(mapId) {

    const mapObjects = {

        // マップA
        mapA: [
            {
                tileX: 50,
                tileY: 12,
                image: '200',
                hitboxWidth: 31,
                hitboxHeight: 30,
                interactable: true,
                interactionType: 'reveal',
                revealImage: '201'
            },
            {
                tileX: 50,
                tileY: 12,
                image: '201',
                hitboxWidth: 31,
                hitboxHeight: 30,
                interactable: false,
                interactionType: 'pickup',
                visible: false
            }
        ],

        // マップB
        mapB: [
            {
                tileX: 13,
                tileY: 3,
                image: 'front_cube',
            },
            {
                tileX: 6,
                tileY: 8,
                image: 'back_cube',
            },
            {
                tileX: 16,
                tileY: 6,
                image: 'right_cube',
            }
        ]
    };

    return mapObjects[mapId] || [];
}


// ================================
// オブジェクトデータの設定
// ================================

function setupObjectsData(scene, mapId = 'mapA') {
    scene.objects = getObjectsDataForMap(mapId).map(obj => ({
        ...obj
    }));
}
