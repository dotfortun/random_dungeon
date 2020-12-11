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
            height: Math.floor(this.pixels.grid/this.pixels.height),
            width: Math.floor(this.pixels.grid/this.pixels.width)
        };

        this.map = {
            cells: new Array(this.tiles.height * this.tiles.width),
            walls: [],
            tiles: new Array(this.tiles.height * this.tiles.width)
        };
    }

    generateLevelBSP(depth=5, grid={ left:0, right:this.tiles.width, up:0, down:this.tiles.height, subgrids:[]}) {
        if (depth >= 0) {
            /* 
                Better way to do this: See if current rect is tall or wide,
                split long dimension in half.
             */
            if (grid.r - grid.l > grid.d - grid.generateLayout) {
                grid.subgrids.push({
                    left: 0,
                    right: Math.floor(grid.r/2),
                    up: 0,
                    down: Math.floor(grid.d/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    left: Math.floor(grid.r/2),
                    right: grid.r,
                    up: Math.floor(grid.d/2),
                    down: grid.d,
                    subgrids:[]
                })
            } else {
                grid.subgrids.push({
                    left: 0,
                    right: Math.floor(grid.r/2),
                    up: 0,
                    down: Math.floor(grid.d/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    left: Math.floor(grid.r/2),
                    right: grid.r,
                    up: Math.floor(grid.d/2),
                    down: grid.d,
                    subgrids:[]
                })
            }
            
            grid.subgrids.forEach(sub => {
                this.generateLevelBSP(depth--, sub);
            });
        }
        return grid;
    }

    generateLayout() {
        // Just places random tiles for now, as a test.
        // for (let y = 0; y < this.height; y++) {
        //     for (let x = 0; x < this.width; x++) {
        //         let cell_type = Math.floor(Math.random() * Math.floor(3));
        //         this.cells[x+y*this.width] = cell_type;
        //         this.tiles[x+y*this.width] = Tile.create({
        //             img: "./modules/random_dungeon/assets/" + cell_type + ".png",
        //             width: this.tile_width,
        //             height: this.tile_height,
        //             scale: 1,
        //             x: x*this.tile_width,
        //             y: y*this.tile_width,
        //             rotation: 0,
        //             hidden: false,
        //             locked: false
        //         });
        //     }
        // }
    }

    render(scene) {
        scene.update({tiles: this.tiles});
    }
}

Hooks.on("ready", _ => {
    console.log("RNG Dungeons: Ding.");
    l = new Level(game.scenes.active.data);
    // l.generate();   
    // l.render(game.scenes.active.data);
});
