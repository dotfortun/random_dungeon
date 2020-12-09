// function getRandomInt(max) {
//     return Math.floor(Math.random() * Math.floor(max));
// }

// class Level {
//     constructor(w, h, t_w, t_h) {
//         this.height = h;
//         this.width = w;
//         this.tile_width = t_w;
//         this.tile_height = t_h;
//         this.cells = new Array(w * h);
//         this.walls = [];
//         this.tiles = new Array(w * h);
//     }

//     generate() {
//         for (y = 0; y < this.height; y++) {
//             for (x = 0; x < this.width; x++) {
//                 cell_type = getRandomInt(3);
//                 this.cells[x+y*this.width] = cell_type;
//                 this.tiles[x+y*this.width] = Tile.create({
//                     img: "assets/" + cell_type + ".png",
//                     width: this.tile_width,
//                     height: this.tile_height,
//                     scale: 1,
//                     x: x*this.tile_width,
//                     y: y*this.tile_width,
//                     rotation: 0,
//                     hidden: false,
//                     locked: true
//                 });
//             }
//         }
//     }

//     render(scene) {
//         scene.tiles = this.tiles;
//     }
// }
