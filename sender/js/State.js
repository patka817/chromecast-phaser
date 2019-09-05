let totaltime = 0;
let timesRun = 0;
const serializeState = (scene) => {
    let s = performance.now();
        const children = scene.children.getChildren();
        const {sprites, texts} = getData(children);
    
    let e = performance.now();
    totaltime = totaltime + (e - s);
    timesRun += 1;
    console.log('Time to serialize this run: ' + (e - s));
    console.log('Time to serialize state per run: ' + (totaltime/timesRun));
    console.log('Nr of sprites serialized: ' + sprites.length);
    return {sprites, texts};
};

function getData(children){
  return children.reduce((data, child) => {
      if (child.active === false) {
          return data;
      }
    // The order matters because Text is a Child of Sprite,
    // so it would evaluate true to both
    if(child.type === 'Texture'){
      let {x, y, text, style } = child;
      data.texts.push({x, y, text, style });
    } else if (child.type === 'Sprite') {
      let {x, y, id, skin, scale, direction } = child;
      data.sprites.push({x, y, id, skin, scale, direction});
    } else {
        console.log('Unhanded child with type: ' + child.type);
    }
    return data;
  }, {
    sprites: [],
    texts: []
  });
}