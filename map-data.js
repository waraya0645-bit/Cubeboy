// ================================
// マップデータの管理
// ================================

function setupMapData(scene, mapId = 'mapA') {

    if (mapId === 'mapA') {
        setupMapAData(scene);
    }

    else if (mapId === 'mapB') {
        setupMapBData(scene);
    }

    else {
        console.error('存在しないマップID:', mapId);
    }
}
