let dt = 0.001;
let expansion_rate = 0.10;
let current_time = 0.0;

let initial_separation = 5.00;
let current_separation = initial_separation;
let light_travel_distance = 0.0;
let distance_to_light = initial_separation;

// Time elapsed
let times = [0];
// Distance between galaxy and earth
let target_distances = [initial_separation];
// Distance between light and Earth
let light_distances = [initial_separation];
// Distance travelled by light
let light_traveled_distances = [0.0];

let n = 0;

while ((distance_to_light > 0) && (n < 1E6)) {
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

console.log(`completed with ${n} iterations`);
console.log(`
Final target_dist ${target_distances[target_distances.length - 1]}
Final light distance ${light_distances[light_distances.length - 1]}
Final light travelled distance ${light_traveled_distances[light_traveled_distances.length - 1]}
`);
