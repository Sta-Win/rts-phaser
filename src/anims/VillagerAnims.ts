export const createVillagerAnims = (anims: Phaser.Animations.AnimationManager) => {
    anims.create({
        key: 'villager-idle-right',
        frames: [{
            key: 'villager',
            frame: 'r0.png',
        }]
    }),
    anims.create({
        key: 'villager-idle-left',
        frames: [{
            key: 'villager',
            frame: 'l0.png'
        }]
    }),
    anims.create({
        key: 'villager-idle-top',
        frames: [{
            key: 'villager',
            frame: 't0.png'
        }]
    }),
    anims.create({
        key: 'villager-idle-bottom',
        frames: [{
            key: 'villager',
            frame: 'b0.png'
        }]
    }),
    anims.create({
        key: 'villager-run-right',
        frames: anims.generateFrameNames('villager', {
            start: 0,
            end: 3,
            prefix: 'r',
            suffix: '.png'
        })
    }),
    anims.create({
        key: 'villager-run-left',
        frames: anims.generateFrameNames('villager', {
            start: 0,
            end: 3,
            prefix: 'l',
            suffix: '.png'
        })
    }),
    anims.create({
        key: 'villager-run-top',
        frames: anims.generateFrameNames('villager', {
            start: 0,
            end: 3,
            prefix: 't',
            suffix: '.png'
        })
    }),
    anims.create({
        key: 'villager-run-bottom',
        frames: anims.generateFrameNames('villager', {
            start: 0,
            end: 3,
            prefix: 'b',
            suffix: '.png'
        })
    })
}