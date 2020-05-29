class Grid {

    constructor(x_max=1000, y_max=1000, step= 40) {
        this.x_max = x_max
        this.y_max = y_max
        this.step = step
    }

    generate_coordiantes(){
        var coordinates = []
        for (let i = 0; i < this.x_max; i+= this.step) {
            for (let j = 0; j < this.y_max; j+= this.step) {
                coordinates.push([i,j])
            }

        }
        return coordinates
    }

    get grid_step() {
        return this.step
    }

    get grid_size(){
        return this.x_max
    }
}

// lets create a class for each grid square
// this will contain its current coordinate, its parent coordinate and heuristic values

class Node{
    constructor(coord, p_coord, g, h) {
        this.coord = coord
        this.p_coord = p_coord
        this.g = g + 1
        this.h = h
        this.f = g + h

    }

    get parent_coord(){
        return this.p_coord
    }

    get current_coordinate(){
        return this.coord
    }

    get f_value(){
        return this.f
    }

    get g_value(){
        return this.g
    }

}

let grid = new Grid()
let grid_step = grid.grid_step
let grid_size = grid.grid_size
let coords = grid.generate_coordiantes()

function euclidian_heuristic(current_point, goal_point){

    let x_diff = current_point[0] - goal_point[0]
    let y_diff = current_point[1] - goal_point[1]
    return Math.round(Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2)), 2)

}


function find_neighbours(current_point, grid_size, rect_size){

    let n_coords = []

    if (current_point[0] <= grid_size - rect_size) {

        n_coords.push([current_point[0] + rect_size, current_point[1]])

    }
    if (current_point[1] <= grid_size - rect_size) {

        n_coords.push([current_point[0], current_point[1] + rect_size])

    }
    if (current_point[0] >= rect_size) {

        n_coords.push([current_point[0] - rect_size, current_point[1]])

    }
    if (current_point[1] >= rect_size) {

        n_coords.push([current_point[0], current_point[1] - rect_size])

    }

    if (current_point[0] >= rect_size && current_point[1] >= rect_size) {

        n_coords.push([current_point[0] - rect_size, current_point[1] - rect_size])

    }
    if (current_point[0] <= grid_size - rect_size && current_point[1] >= rect_size) {

        n_coords.push([current_point[0] + rect_size, current_point[1] - rect_size])

    }
    if (current_point[0] <= grid_size - rect_size && current_point[1] >= grid_size - rect_size) {

        n_coords.push([current_point[0] + rect_size, current_point[1] + rect_size])

    }
    if (current_point[0] >= rect_size && current_point[1] >= grid_size - rect_size) {

        n_coords.push([current_point[0] - rect_size, current_point[1] + rect_size])

    }
    return n_coords

}


function A_star(start_coordinate, end_coordinate, obsticles){

    let open_list = []
    let closed_list = []

    // add start coordinate to open list
    let start_node = new Node(start_coordinate, null, 0, euclidian_heuristic(start_coordinate, end_coordinate))
    let end_node = new Node(end_coordinate, null, 0, 0)

    open_list.push(start_node)

    for (let o = 0; o < obsticles.length; o++) {
        closed_list.push(new Node(obsticles[o], null, null, null))
    }

    let expanded_node_count = 1

    while(open_list.length > 0){

        let current_node = find_lowest_f_value(open_list)
        expanded_node_count += 1

        if (current_node.current_coordinate[0] === end_coordinate[0] && current_node.current_coordinate[1] === end_coordinate[1]){

            let path = []
            let curr_node = current_node

            while(curr_node.parent_coord){
                path.push(curr_node.current_coordinate)
                curr_node = curr_node.parent_coord
            }
            path.push(start_node.current_coordinate)
            return path.reverse()
        }
        // push current node into open list
        if (current_node.current_coordinate !== start_coordinate){
            open_list.push(current_node)
        }
        //    remove from open list
        open_list = remove_from_from_list(current_node, open_list)

        //    neighbours
        let neighbours = find_neighbours(current_node.current_coordinate, grid_size, grid_step)

        for (let y = 0; y < neighbours.length; y++) {

            let n = new Node(neighbours[y], current_node, current_node.g_value, euclidian_heuristic(neighbours[y], end_node.current_coordinate))

            if (check_if_in_closed_list(n.current_coordinate, closed_list)){
                continue
            }

            expanded_node_count += 1
            //   now we check if neighbour is in open list
            if(!check_if_in_closed_list(n.current_coordinate, open_list)){
                open_list.push(n)
            } else {
                for (let i = 0; i < open_list.length; i++) {
                    if (open_list[i].current_coordinate === n.current_coordinate){
                        if (open_list[i].f_value > n.f_value){
                            open_list[i] = n
                        }
                    }
                }
            }
        }
    }
}

function find_lowest_f_value(list){
    let index = 0
    for (let i = 0; i < list.length; i++) {
        if(list[i].f_value < list[index].f_value){
            index = i
        }
    }
    return list[index]
}

function remove_from_from_list(node, list){
    for (let i = 0; i < list.length; i++) {
        if (list[i].current_coordinate === node.current_coordinate){
            list.splice(i, 1)
        }
    }
    return list
}


function check_if_in_closed_list(coordinate, list){
    for (let i = 0; i < list.length; i++) {
        let curr = list[i].current_coordinate
        if(curr[0] === coordinate[0] && curr[1] === coordinate[1]){
            return true
        }
    }
    return false
}
// function A_star(start_coordinate, end_coordinate, obsticles){
//
//     let open_list = []
//     let closed_list = []
//
//     // add start coordinate to open list
//
//     let start_node = new Node(start_coordinate, null, 0, choose_heuristic(start_coordinate, end_coordinate))
//     let end_node = new Node(end_coordinate, null, 0, 0)
//
//     open_list.push(start_node)
//
//     for (let o = 0; o < obsticles.length; o++) {
//         closed_list.push(new Node(obsticles[o], null, null, null))
//     }
//
//     let counter = 0
//
//     let infinite_list = []
//
//     while(open_list.length){
//
//         let current_node = find_lowest_f_value(open_list)
//
//         infinite_list.push(current_node.current_coordinate)
//         // current_node.current_coordinate[0] === end_coordinate[0] && current_node.current_coordinate[1] === end_coordinate[1]
//         if (current_node.current_coordinate === end_coordinate){
//
//             console.log("done")
//             open_l = open_list
//             closed_l = closed_list
//
//             let path = []
//             let curr_node = current_node
//
//             while(curr_node.parent_coord){
//                 path.push(curr_node.current_coordinate)
//                 curr_node = curr_node.parent_coord
//             }
//             path.push(start_node.current_coordinate)
//             return path.reverse()
//         }
//
//         if (!check_if_infinite(infinite_list)){
//
//             console.log("infinite")
//             // let curr = current_node
//             // let par = current_node.parent_coord
//             //
//             // console.log(par, curr)
//             // let test = find_neighbours(current_node.current_coordinate, grid_size, grid_step)
//             //
//             // for (let i = 0; i < test.length; i++) {
//             //     for (let j = 0; j < closed_list.length; j++) {
//             //         if (closed_list[j].current_coordinate === test[i]){
//             //             closed_list.splice(j, 1)
//             //         }
//             //     }
//             // }
//             //
//             // let parent = current_node.parent_coord
//             // current_node = parent
//
//
//             open_l = open_list
//             closed_l = closed_list
//
//             let path = []
//             let curr_node = current_node
//
//             while(curr_node.parent_coord){
//                 path.push(curr_node.current_coordinate)
//                 curr_node = curr_node.parent_coord
//             }
//             path.push(start_node.current_coordinate)
//             return path.reverse()
//         }
//
//         // push current node into open list
//         // if (current_node.current_coordinate !== start_coordinate && check_if_in_closed_list(current_node.current_coordinate, closed_list)){
//         closed_list.push(current_node)
//         // }
//         open_list = remove_from_from_list(current_node, open_list)
//
//         let neighbours = find_neighbours(current_node.current_coordinate, grid_size, grid_step)
//         // counter = 0
//
//         for (let y = 0; y < neighbours.length; y++) {
//
//             let n = new Node(neighbours[y], current_node, current_node.g_value + 1, choose_heuristic(neighbours[y], end_node.current_coordinate))
//
//             if (check_if_in_closed_list(n.current_coordinate, closed_list)){
//
//                 // counter >= neighbours.length || n.current_coordinate === end_coordinate
//                 // if (counter >= neighbours.length || n.current_coordinate === end_coordinate) {
//                 //
//                 // open_l = open_list
//                 // closed_l = closed_list
//                 //
//                 // let path = []
//                 // let curr_node = current_node
//                 //
//                 // while (curr_node.parent_coord) {
//                 //     path.push(curr_node.current_coordinate)
//                 //     curr_node = curr_node.parent_coord
//                 // }
//                 // path.push(start_node.current_coordinate)
//                 // return path.reverse()
//
//                 // } else {
//                 //     counter += 1
//                 continue
//             }
//
//             if(!check_if_in_closed_list(n.current_coordinate, open_list)){
//                 open_list.push(n)
//             } else {
//                 for (let i = 0; i < open_list.length; i++) {
//                     if (open_list[i].current_coordinate === n.current_coordinate){
//                         if (open_list[i].f_value > n.f_value){
//                             open_list[i] = n
//                         }
//                     }
//                 }
//             }
//         }
//     }
//
// }
