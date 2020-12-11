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

    generateLevelBSP(depth=5, grid={ l:0, r:this.tiles.width, t:0, b:this.tiles.height, subgrids:[]}) {
        if (depth >= 0) {
            // This is a terrible way to decide if a room should be tall or wide.
            if (depth%2) {
                grid.subgrids.push({
                    l: 0,
                    r: Math.floor(grid.r/2),
                    t: 0,
                    b: Math.floor(grid.b/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    l: Math.floor(grid.r/2),
                    r: grid.r,
                    t: Math.floor(grid.b/2),
                    b: grid.b,
                    subgrids:[]
                })
            } else {
                grid.subgrids.push({
                    l: 0,
                    r: Math.floor(grid.r/2),
                    t: 0,
                    b: Math.floor(grid.b/2),
                    subgrids:[]
                })
                grid.subgrids.push({
                    l: Math.floor(grid.r/2),
                    r: grid.r,
                    t: Math.floor(grid.b/2),
                    b: grid.b,
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
