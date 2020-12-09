function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Level {
    constructor(w, h, t_w, t_h) {
        this.height = Math.floor(h/t_h);
        this.width = Math.floor(w/t_w);
        this.tile_width = t_w;
        this.tile_height = t_h;
        this.cells = new Array(this.width * this.height);
        this.walls = [];
        this.tiles = new Array(this.width * this.height);
    }

    generate() {
        // Just places random tiles for now, as a test.
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                let cell_type = Math.floor(Math.random() * Math.floor(3));
                this.cells[x+y*this.width] = cell_type;
                this.tiles[x+y*this.width] = Tile.create({
                    img: "./modules/random_dungeon/assets/" + cell_type + ".png",
                    width: this.tile_width,
                    height: this.tile_height,
                    scale: 1,
                    x: x*this.tile_width,
                    y: y*this.tile_width,
                    rotation: 0,
                    hidden: false,
                    locked: false
                });
            }
        }
    }

    render(scene) {
        scene.update({tiles: this.tiles});
    }
}

Hooks.on("ready", _ => {
    console.log("RNG Dungeons: Ding.");
    scene = game.scenes.active.data;
    l = new Level(scene.width, scene.height, scene.grid, scene.grid);
    l.generate();   
    l.render(scene);
});
