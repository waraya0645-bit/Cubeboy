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
        mapB: []
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
