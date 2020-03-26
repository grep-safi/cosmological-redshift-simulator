let dt = 0.001;
let expansion_rate = 0.1;
let current_time = 0.0;

let initial_separation = 5;
let current_separation = initial_separation;
let light_travel_distance = 0.0;
let distance_to_light = initial_separation;

let times = [0];
let target_distances = [initial_separation];
let light_distances = [initial_separation];
let light_traveled_distances = [0.0];

let n = 0;

while ((distance_to_light > 0)) {
    current_separation += current_separation * expansion_rate*dt;
    distance_to_light += distance_to_light * expansion_rate*dt;

    distance_to_light -= dt;
    light_travel_distance = light_travel_distance + dt;

    current_time += dt;

    times.push(current_time);
    target_distances.push(current_separation);
    light_distances.push(distance_to_light);
    light_traveled_distances.push(light_travel_distance);

    n += 1;
}


// let dt = 0.001;
// let expansion_rate = 0.1;
// let rate_per_year = expansion_rate;
// let current_time = 0.0;
//
// let initial_separation = 5;
// let current_separation = initial_separation;
// let light_travel_distance = 0.0;
// let distance_to_light = initial_separation;
// let distance_from_light_to_target = 0.0;
//
//
// let times = [0];
// let target_distances = [initial_separation];
// let light_distances = [initial_separation];
// let light_target_distances = [0.0];
// let light_traveled_distances = [0.0];
//
//
// let oh_no_too_far = 0;
// let run_too_long = 0;
// console.log(`${rate_per_year*dt},
//     ${current_separation * rate_per_year},
//     ${current_separation * rate_per_year*dt},
//     ${current_separation + current_separation * rate_per_year*dt}`
// );
//
// while ((distance_to_light > 0) && (oh_no_too_far < 1000) && (run_too_long < 10000)) {
//     current_separation = current_separation + current_separation * rate_per_year*dt;
//     distance_to_light = distance_to_light + distance_to_light * rate_per_year*dt;
//     distance_from_light_to_target = distance_from_light_to_target * (1.0+ rate_per_year*dt);
//
//
//     distance_from_light_to_target = distance_from_light_to_target + dt;
//     distance_to_light = distance_to_light - dt;
//     light_travel_distance = light_travel_distance + dt;
//
//
//     current_time = current_time + dt;
//
//
//     times.push(current_time);
//     target_distances.push(current_separation);
//     light_distances.push(distance_to_light);
//     light_target_distances.push(distance_from_light_to_target);
//     light_traveled_distances.push(light_travel_distance);
//
//
//     if (distance_to_light * rate_per_year >= 1) {
//         oh_no_too_far = oh_no_too_far + 1
//     }
//
//     run_too_long = run_too_long + 1;
// }
//
// console.log(`yeet ${current_time},${oh_no_too_far}, ${run_too_long}`)
// console.log(`part 2 ${times[times.length - 1]},
//              ${target_distances.length - 0}
//              ${light_distances.length - 1}
//              ${light_target_distances.length - 1},
//              ${light_traveled_distances.length - 1}`);

// let dt = 0.001;
// let expansion_rate = 0.1;
// let rate_per_year = expansion_rate;
// let current_time = 0.0;
//
// let initial_separation = 5;
// let current_separation = initial_separation;
// let light_travel_distance = 0.0;
// let distance_to_light = initial_separation;
// let distance_from_light_to_target = 0.0;
//
//
// let times = [0];
// let target_distances = [initial_separation];
// let light_distances = [initial_separation];
// let light_target_distances = [0.0];
// let light_traveled_distances = [0.0];
//
//
// let oh_no_too_far = 0;
// let run_too_long = 0;
// console.log(`${rate_per_year*dt},
//     ${current_separation * rate_per_year},
//     ${current_separation * rate_per_year*dt},
//     ${current_separation + current_separation * rate_per_year*dt}`
// );
//
// while ((distance_to_light > 0) && (oh_no_too_far < 1000) && (run_too_long < 10000)) {
//     current_separation = current_separation + current_separation * rate_per_year*dt;
//     distance_to_light = distance_to_light + distance_to_light * rate_per_year*dt;
//     distance_from_light_to_target = distance_from_light_to_target * (1.0+ rate_per_year*dt);
//
//
//     distance_from_light_to_target = distance_from_light_to_target + dt;
//     distance_to_light = distance_to_light - dt;
//     light_travel_distance = light_travel_distance + dt;
//
//
//     current_time = current_time + dt;
//
//
//     times.push(current_time);
//     target_distances.push(current_separation);
//     light_distances.push(distance_to_light);
//     light_target_distances.push(distance_from_light_to_target);
//     light_traveled_distances.push(light_travel_distance);
//
//
//     if (distance_to_light * rate_per_year >= 1) {
//         oh_no_too_far = oh_no_too_far + 1
//     }
//
//     run_too_long = run_too_long + 1;
// }
//
// console.log(`yeet ${current_time},${oh_no_too_far}, ${run_too_long}`)
// console.log(`part 2 ${times[times.length - 1]},
//              ${target_distances[target_distances.length - 1]}
//              ${light_distances[light_distances.length - 1]}
//              ${light_target_distances[light_target_distances.length - 1]},
//              ${light_traveled_distances[light_traveled_distances.length - 1]}`);

// let dt = 1E6;
// let expansion_rate = 0.01;
// let rate_per_year = expansion_rate / 1E8;
// let current_time = 0.0;
//
// let initial_separation = 5E9;
// let current_separation = initial_separation;
// let light_travel_distance = 0.0;
// let distance_to_light = initial_separation;
// let distance_from_light_to_target = 0.0;
//
//
// let times = [0];
// let target_distances = [initial_separation]
// let light_distances = [initial_separation]
// let light_target_distances = [0.0]
// let light_traveled_distances = [0.0]
//
//
// let oh_no_too_far = 0
// let run_too_long = 0
// console.log(`${rate_per_year*dt},
//     ${current_separation * rate_per_year},
//     ${current_separation * rate_per_year*dt},
//     ${current_separation + current_separation * rate_per_year*dt}`
// );
//
//
//
// while ((distance_to_light > 0) && (oh_no_too_far < 1000) && (run_too_long < 10000)) {
//
//     current_separation = current_separation + current_separation * rate_per_year*dt;
//     distance_to_light = distance_to_light + distance_to_light * rate_per_year*dt;
//     distance_from_light_to_target = distance_from_light_to_target * (1.0+ rate_per_year*dt);
//
//
//     distance_from_light_to_target = distance_from_light_to_target + dt;
//     distance_to_light = distance_to_light - dt;
//     light_travel_distance = light_travel_distance + dt;
//
//
//     current_time = current_time + dt;
//
//
//     times.push(current_time);
//     target_distances.push(current_separation);
//     light_distances.push(distance_to_light);
//     light_target_distances.push(distance_from_light_to_target);
//     light_traveled_distances.push(light_travel_distance);
//
//
//     if (distance_to_light * rate_per_year >= 1) {
//         oh_no_too_far = oh_no_too_far + 1
//     }
//
//     run_too_long = run_too_long + 1;
// }
//
// console.log(`yeet ${current_time},${oh_no_too_far}, ${run_too_long}`)
// console.log(`part 2 ${times[times.length - 1]},
//              ${target_distances[target_distances.length - 1]}
//              ${light_distances[light_distances.length - 2]}
//              ${light_target_distances[light_target_distances.length - 1]},
//              ${light_traveled_distances[light_traveled_distances.length - 1]}`);




