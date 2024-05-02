export function hasDynamicBody(body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | null): body is Phaser.Physics.Arcade.Body {
    return body?.physicsType === Phaser.Physics.Arcade.DYNAMIC_BODY;
}