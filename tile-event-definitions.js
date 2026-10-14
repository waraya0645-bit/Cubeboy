function setupTileEventDefinitions(scene) {
    scene.tileEventDefinitions = {
        1: {
            interactionType: 'talk',
            once: true,
            trigger: 'interact',
            parameters: {
                message: 'こんにちは'
            }
        },

        2: {
            interactionType: 'other',
            once: false,
            trigger: 'step',
            parameters: {
                value: 123
            }
        }
    };
}
