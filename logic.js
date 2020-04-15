
const fn = (array) => {
    return (num, index) => {
        array[index] += 2;
        return num + 1;
    };
};
let arr = [1, 3, 5, 7, 9, 11];

let modified = arr.map(fn(arr));

console.log(`arr: ${arr} and modified: ${modified}`);



// const fs = require('fs');
//
// let data = fs.readFileSync("./output.txt");
// let tmp = JSON.parse(data);
//
// console.log(tmp);
//
// for (let i = 0; i < tmp.length; i++) {
//     console.log(tmp[i].cx);
// }
//
// // Data which will write in a file.
// let data = "amsdoginasdo jakds ";

// Write data in 'Output.txt' .
// fs.writeFile('output.txt', data, {'flags': 'a'}, (err) => {
//
//     In case of a error throw err.
    // if (err) throw err;
// });

// fs.appendFileSync("output.txt", 'My Text', {'flags': 'a+'});
//
// let width = 910;
// let height = 290;
// let maxRadius = 3.5;
// let numOfStars = 110;
//
// let bgStars = [];
// for (let i = 0; i < numOfStars; i++) {
//     let circleX = Math.random() * (width - 5) + 5;
//     let circleY = Math.random() * (height - 5) + 5;
//     let radius = Math.random() * (maxRadius - 1) + 1;
//     // let starOpacity = `rgba(255,255,255,${Math.random()})`;
//     let starOpacity = Math.random() * (0.25) + 0.75;
//     let fill = "rgba(255,255,255," + starOpacity + ")";
//
//     let starProperties = {
//         cx: circleX,
//         cy: circleY,
//         r: radius,
//         fill: fill,
//         key: i,
//     };
//
//     bgStars.push(starProperties);
//     let temp = JSON.stringify(starProperties);
//     console.log(temp);
// }

// let dt = 0.001;
// let expansion_rate = 0.13;
// let current_time = 0.0;
//
// let initial_separation = 5.00;
// let current_separation = initial_separation;
// let light_travel_distance = 0.0;
// let distance_to_light = initial_separation;
//
// // Time elapsed
// let times = [0];
// // Distance between galaxy and earth
// let target_distances = [initial_separation];
// // Distance between light and Earth
// let light_distances = [initial_separation];
// // Distance travelled by light
// let light_traveled_distances = [0.0];
//
// let n = 0;
//
// while ((distance_to_light > 0) && (n < 1E6)) {
//     current_separation += current_separation * expansion_rate*dt;
//     distance_to_light += distance_to_light * expansion_rate*dt;
//
//     distance_to_light -= dt;
//     light_travel_distance = light_travel_distance + dt;
//
//     current_time += dt;
//
//     if (target_distances.length > 1) {
//         console.log(`current separation: ${current_separation} previous separation: ${target_distances[target_distances.length - 1]} n: ${n} ratio: ${current_separation - target_distances[target_distances.length - 1]}`);
//     }
//
//     times.push(current_time);
//     target_distances.push(current_separation);
//     light_distances.push(distance_to_light);
//     light_traveled_distances.push(light_travel_distance);
//
//     n += 1;
// }
//
// console.log(`completed with ${n} iterations`);
// console.log(`
// Final target_dist ${target_distances[target_distances.length - 1]}
// Final light distance ${light_distances[light_distances.length - 1]}
// Final light travelled distance ${light_traveled_distances[light_traveled_distances.length - 1]}
// `);
