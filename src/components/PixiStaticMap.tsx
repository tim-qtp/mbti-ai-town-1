import { PixiComponent, applyDefaultProps } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { AnimatedSprite, WorldMap } from '../../convex/aiTown/worldMap';
import * as campfire from '../../data/animations/campfire.json';
import * as bubbles1 from '../../data/animations/bubbles1.json';
import * as bubbles2 from '../../data/animations/bubbles1.json';
import * as fish from '../../data/animations/fish.json';
import * as whale from '../../data/animations/whale.json';
import * as topleft from '../../data/animations/1.json';
import * as topmiddle from '../../data/animations/2.json';
import * as topright from '../../data/animations/3.json';
import * as middleleft from '../../data/animations/4.json';
import * as middleright from '../../data/animations/5.json';
import * as bottomleft from '../../data/animations/6.json';
import * as bottommiddle from '../../data/animations/7.json';
import * as bottomright from '../../data/animations/8.json';
import * as innertopleft from '../../data/animations/9.json';
import * as innertopright from '../../data/animations/10.json';
import * as innerbottomleft from '../../data/animations/11.json';
import * as innerbottomright from '../../data/animations/12.json';

const animations = {
  'campfire.json': { spritesheet: campfire, url: '/ai/assets/spritesheets/campfire.png' },
  'bubbles1.json': { spritesheet: bubbles1, url: '/ai/assets/spritesheets/bubbles1.png' },
  'bubbles2.json': { spritesheet: bubbles2, url: '/ai/assets/spritesheets/bubbles2.png' },
  'fish.json': { spritesheet: fish, url: '/ai/assets/spritesheets/bubbles1.png' },
  'whale.json': { spritesheet: whale, url: '/ai/assets/spritesheets/bubbles2.png' },
  '1.json': { spritesheet: topleft, url: '/ai/assets/spritesheets/beachedges.png' },
  '2.json': { spritesheet: topmiddle, url: '/ai/assets/spritesheets/beachedges.png' },
  '3.json': { spritesheet: topright, url: '/ai/assets/spritesheets/beachedges.png' },
  '4.json': { spritesheet: middleleft, url: '/ai/assets/spritesheets/beachedges.png' },
  '5.json': { spritesheet: middleright, url: '/ai/assets/spritesheets/beachedges.png' },
  '6.json': { spritesheet: bottomleft, url: '/ai/assets/spritesheets/beachedges.png' },
  '7.json': { spritesheet: bottommiddle, url: '/ai/assets/spritesheets/beachedges.png' },
  '8.json': { spritesheet: bottomright, url: '/ai/assets/spritesheets/beachedges.png' },
  '9.json': { spritesheet: innertopleft, url: '/ai/assets/spritesheets/beachedges.png' },
  '10.json': { spritesheet: innertopright, url: '/ai/assets/spritesheets/beachedges.png' },
  '11.json': { spritesheet: innerbottomleft, url: '/ai/assets/spritesheets/beachedges.png' },
  '12.json': {
    spritesheet: innerbottomright,
    url: '/ai/assets/spritesheets/beachedges.png',
  },
};

export const PixiStaticMap = PixiComponent('StaticMap', {
  create: (props: { map: WorldMap; [k: string]: any }) => {
    const map = props.map;
    const numxtiles = Math.floor(map.tileSetDimX / map.tileDim);
    const numytiles = Math.floor(map.tileSetDimY / map.tileDim);
    const bt = PIXI.BaseTexture.from(map.tileSetUrl, {
      scaleMode: PIXI.SCALE_MODES.NEAREST,
    });

    const tiles = [];
    for (let x = 0; x < numxtiles; x++) {
      for (let y = 0; y < numytiles; y++) {
        tiles[x + y * numxtiles] = new PIXI.Texture(
          bt,
          new PIXI.Rectangle(x * map.tileDim, y * map.tileDim, map.tileDim, map.tileDim),
        );
      }
    }
    const screenxtiles = map.bgTiles[0].length;
    const screenytiles = map.bgTiles[0][0].length;

    const container = new PIXI.Container();
    const allLayers = [...map.bgTiles, ...map.objectTiles];

    // blit bg & object layers of map onto canvas
    for (let i = 0; i < screenxtiles * screenytiles; i++) {
      const x = i % screenxtiles;
      const y = Math.floor(i / screenxtiles);
      const xPx = x * map.tileDim;
      const yPx = y * map.tileDim;

      // Add all layers of backgrounds.
      for (const layer of allLayers) {
        const tileIndex = layer[x][y];
        // Some layers may not have tiles at this location.
        if (tileIndex === -1) continue;
        const ctile = new PIXI.Sprite(tiles[tileIndex]);
        ctile.x = xPx;
        ctile.y = yPx;
        container.addChild(ctile);
      }
    }

    // TODO: Add layers.
    const spritesBySheet = new Map<string, AnimatedSprite[]>();
    for (const sprite of map.animatedSprites) {
      const sheet = sprite.sheet;
      if (!spritesBySheet.has(sheet)) {
        spritesBySheet.set(sheet, []);
      }
      spritesBySheet.get(sheet)!.push(sprite);
    }
    for (const [sheet, sprites] of spritesBySheet.entries()) {
      const animation = (animations as any)[sheet];
      if (!animation) {
        console.error('Could not find animation', sheet);
        continue;
      }
      const { spritesheet, url } = animation;
      const texture = PIXI.BaseTexture.from(url, {
        scaleMode: PIXI.SCALE_MODES.NEAREST,
      });
      const spriteSheet = new PIXI.Spritesheet(texture, spritesheet);
      spriteSheet.parse().then(() => {
        for (const sprite of sprites) {
          const pixiAnimation = spriteSheet.animations[sprite.animation];
          if (!pixiAnimation) {
            console.error('Failed to load animation', sprite);
            continue;
          }
          const pixiSprite = new PIXI.AnimatedSprite(pixiAnimation);
          pixiSprite.animationSpeed = 0.1;
          pixiSprite.autoUpdate = true;
          pixiSprite.x = sprite.x;
          pixiSprite.y = sprite.y;
          pixiSprite.width = sprite.w;
          pixiSprite.height = sprite.h;
          container.addChild(pixiSprite);
          pixiSprite.play();
        }
      });
    }

    container.x = 0;
    container.y = 0;

    // Set the hit area manually to ensure `pointerdown` events are delivered to this container.
    container.interactive = true;
    container.hitArea = new PIXI.Rectangle(
      0,
      0,
      screenxtiles * map.tileDim,
      screenytiles * map.tileDim,
    );

    return container;
  },

  applyProps: (instance, oldProps, newProps) => {
    applyDefaultProps(instance, oldProps, newProps);
  },
});
