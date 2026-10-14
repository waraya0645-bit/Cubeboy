function setupTileEventDefinitions(scene) {
    scene.tileEventDefinitions = {
        1: {
            interactionType: 'talk',
            once: true,
            parameters: {
                message: 'こんにちは'
            }
        },

        2: {
            interactionType: 'other',
            once: false,
            parameters: {
                value: 123
            }
        }
    };
}
