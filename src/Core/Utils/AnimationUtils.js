var sharedAnimation = function(config){
    var animation = cc.animationCache.getAnimation(config.label);
    if(animation == null){
        var animFrames = [];
        for (var i = config.from; i <= config.to; i++) {
            var str = config.prefix + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }
        animation = cc.Animation.create(animFrames, config.time);
        cc.animationCache.addAnimation(animation, config.label);
    }
    return animation;
}


var sharedAnimationForever = function(config){
    var animation = sharedAnimation(config);
    var sprite = new cc.Sprite();
    var animate = new cc.Animate(animation);
    sprite.runAction(cc.repeatForever(animate));
    return sprite;
}

var sharedAnimationOnce = function(config){
    var animation = sharedAnimation(config);
    var sprite = new cc.Sprite();
    var animate = new cc.Animate(animation);
    sprite.runAction(animate);
    return sprite;
}


var makeSpineWithJson = function(jsonFile,atlasFile,scale){
    return sp.SkeletonAnimation.createWithJsonFile(jsonFile, atlasFile,scale);
}