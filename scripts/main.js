function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class Room {
    constructor(up, right, down, left) {
        this.walls = {
            up: up,
            right: right,
            down: down,
            left: left,
        }
    }

    center() {
        return {
            x: Math.floor((this.walls.up + this.walls.down)/2),
            y: Math.floor((this.walls.left + this.walls.right)/2)
        }
    }

    dims() {
        return {
            width: this.walls.right - this.walls.left,
            height: this.walls.down - this.walls.up,
        }
    }

    grow() {
        this.walls.up--;
        this.walls.right++;
        this.walls.down++;
        this.walls.left--;
    }

    overlap(other) {
        if (other.walls.bottom < this.walls.top || other.walls.top > this.walls.bottom) {
            return false;
        }
        if (other.walls.left > this.walls.right || other.walls.right < this.walls.left) {
            return false;
        }
        return true;
    }
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

    generateGrowingRooms(rooms=6) {
        let room_set = new Set();
        while (room_set.size < rooms) {
            let x = getRandomInt(this.tiles.width);
            let y = getRandomInt(this.tiles.height);
            room_set.add(new Room(x, y, x, y));
        }
        console.warn(room_set);
    }

    generateBSP(depth=5, grid={ left:0, right:this.tiles.width, up:0, down:this.tiles.height, subgrids:[]}) {
        if (depth > 0) {
            grid.subgrids.push({
                left: grid.left,
                right: 1 + grid.left + 2 * getRandomInt(Math.floor(grid.right/3)),
                up: grid.up,
                down: 1 + grid.up + 2 * getRandomInt(Math.floor(grid.right/3)),
                subgrids:[]
            })
            grid.subgrids.push({
                left: 1 + grid.left + 2 * getRandomInt(Math.floor(grid.right/3)),
                right: grid.right,
                up: 1 + grid.up + 2 * getRandomInt(Math.floor(grid.right/3)),
                down: grid.down,
                subgrids:[]
            })
            // if (grid.right - grid.left > grid.down - grid.up) {
            //     grid.subgrids.push({
            //         left: grid.left,
            //         right: grid.left + getRandomInt(Math.floor(grid.right/2)),
            //         up: grid.up,
            //         down: grid.up + getRandomInt(Math.floor(grid.right/2)),
            //         subgrids:[]
            //     })
            //     grid.subgrids.push({
            //         left: grid.left + getRandomInt(Math.floor(grid.right/2)),
            //         right: grid.right,
            //         up: grid.up + getRandomInt(Math.floor(grid.right/2)),
            //         down: grid.down,
            //         subgrids:[]
            //     })
            // } else {
            //     grid.subgrids.push({
            //         left: 0,
            //         right: Math.floor(grid.right/2),
            //         up: 0,
            //         down: Math.floor(grid.down/2),
            //         subgrids:[]
            //     })
            //     grid.subgrids.push({
            //         left: Math.floor(grid.right/2),
            //         right: grid.right,
            //         up: Math.floor(grid.down/2),
            //         down: grid.down,
            //         subgrids:[]
            //     })
            // }
            
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

    generateLayoutBSP() {
        // Just places random tiles for now, as a test.
        this.layout.forEach(room => {
            for (let x = room.left; x <= room.right; x++) {
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
                    x: (this.pixels.padding * this.pixels.width) + (x * this.pixels.grid),
                    y: (this.pixels.padding * this.pixels.height) + (room.down * this.pixels.grid),
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
            }
            for (let y = room.up; y <= room.down; y++) {
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/0.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + (room.left * this.pixels.grid),
                    y: (this.pixels.padding * this.pixels.height) + (y * this.pixels.grid),
                    rotation: 0,
                    hidden: false,
                    locked: false
                }));
                this.map.tiles.push(Tile.create({
                    img: "./modules/random_dungeon/assets/0.png",
                    width: this.pixels.grid,
                    height: this.pixels.grid,
                    scale: 1,
                    x: (this.pixels.padding * this.pixels.width) + (room.right * this.pixels.grid),
                    y: (this.pixels.padding * this.pixels.height) + (y * this.pixels.grid),
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
    console.warn("RNG Dungeons: Ding.");
    let l = new Level(game.scenes.active.data);
    // let bsp = l.generateBSP(depth=2);
    // l.flattenBSPTree(bsp);
    // l.generateLayout();
    l.generateGrowingRooms();
    console.warn(l);
    // l.render(game.scenes.active);
});
