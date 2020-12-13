function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Level {
    constructor(level) {
        this.pixels = {
            height: level.height,
            width: level.width,
            grid: level.grid,
            padding: level.padding
        };

        this.tiles = {
            height: Math.floor(this.pixels.height/this.pixels.grid),
            width: Math.floor(this.pixels.width/this.pixels.grid)
        };

        this.map = {
            cells: new Array(this.tiles.height * this.tiles.width),
            walls: [],
            tiles: []
        };

        this.layout = [];
    }

    generateBSP(depth=5, grid={ left:0, right:this.tiles.width, up:0, down:this.tiles.height, subgrids:[]}) {
        if (depth > 0) {
            if (grid.right - grid.left > grid.down - grid.up) {
                grid.subgrids.push({
                    left: 0,
                    right: Math.floor(grid.right/2),
                    up: 0,
                    down: Math.floor(grid.down/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    left: Math.floor(grid.right/2),
                    right: grid.right,
                    up: Math.floor(grid.down/2),
                    down: grid.down,
                    subgrids:[]
                })
            } else {
                grid.subgrids.push({
                    left: 0,
                    right: Math.floor(grid.right/2),
                    up: 0,
                    down: Math.floor(grid.down/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    left: Math.floor(grid.right/2),
                    right: grid.right,
                    up: Math.floor(grid.down/2),
                    down: grid.down,
                    subgrids:[]
                })
            }
            
            grid.subgrids.forEach(sub => {
                this.generateBSP(depth-1, sub);
            });

            return grid;
        }
    }

    flattenBSPTree(bsp_tree) {
        this.layout.push(bsp_tree);
        bsp_tree.subgrids.forEach(sub => {
            this.flattenBSPTree(sub);
        });    
    }

    generateLayout() {
        // Just places random tiles for now, as a test.
        this.layout.forEach(room => {
            for (let x = room.left; x < room.right; x++) {
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/0.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + x * this.pixels.grid,
                    y: (this.pixels.padding * this.pixels.height) + room.up * this.pixels.grid,
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/0.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + x * this.pixels.grid,
                    y: (this.pixels.padding * this.pixels.height) + room.down * this.pixels.grid,
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
            }
            for (let y = room.top; y < room.bottom; y++) {
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/1.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + room.left * this.pixels.grid,
                    y: (this.pixels.padding * this.pixels.height) + y * this.pixels.grid,
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/1.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + room.right * this.pixels.grid,
                    y: (this.pixels.padding * this.pixels.height) + y * this.pixels.grid,
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
            }
        });
    }

    render(scene) {
        scene.update({tiles: this.map.tiles});
    }
}

Hooks.on("ready", _ => {
    console.log("RNG Dungeons: Ding.");
    let l = new Level(game.scenes.active.data);
    let bsp = l.generateBSP(depth=3);
    l.flattenBSPTree(bsp);
    l.generateLayout();
    // l.render(game.scenes.active);
});
