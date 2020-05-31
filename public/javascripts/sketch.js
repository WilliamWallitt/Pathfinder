
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

class Node{
    constructor(coord, p_coord, g, h) {
        this.coord = coord
        this.p_coord = p_coord
        this.g = g
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

function euclidian_heuristic(current_point, goal_point){

    let x_diff = current_point[0] - goal_point[0]
    let y_diff = current_point[1] - goal_point[1]
    return Math.round(Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2)), 2)

}

function manhattan_heuristic(current_point, goal_point){
    let x_diff = current_point[0] - goal_point[0]
    let y_diff = current_point[1] - goal_point[1]

    return Math.round(Math.abs(x_diff) + Math.abs(y_diff))
}

// add other functions


function find_neighbours(current_point, grid_size, rect_size){

    let n_coords = []

    if (current_point[0] < grid_size - rect_size) {

        n_coords.push([current_point[0] + rect_size, current_point[1]])

    }
    if (current_point[1] < grid_size - rect_size) {

        n_coords.push([current_point[0], current_point[1] + rect_size])

    }
    if (current_point[0] >= rect_size) {

        n_coords.push([current_point[0] - rect_size, current_point[1]])

    }
    if (current_point[1] >= rect_size) {

        n_coords.push([current_point[0], current_point[1] - rect_size])

    }

    if (diagonal){

        if (current_point[0] >= rect_size && current_point[1] >= rect_size) {

            n_coords.push([current_point[0] - rect_size, current_point[1] - rect_size])

        }
        if (current_point[0] < grid_size - rect_size && current_point[1] >= rect_size) {

            n_coords.push([current_point[0] + rect_size, current_point[1] - rect_size])

        }
        if (current_point[0] < grid_size - rect_size && current_point[1] > grid_size - rect_size) {

            n_coords.push([current_point[0] + rect_size, current_point[1] + rect_size])

        }
        if (current_point[0] >= rect_size && current_point[1] > grid_size - rect_size) {

            n_coords.push([current_point[0] - rect_size, current_point[1] + rect_size])

        }
    }
    return n_coords
}

function choose_heuristic(start, end){

    if (manhatten){
        return manhattan_heuristic(start, end)
    } else {
        return euclidian_heuristic(start, end)
    }

}

function A_star(start_coordinate, end_coordinate, obsticles){

    let open_list = []
    let closed_list = []

    // add start coordinate to open list

    let start_node = new Node(start_coordinate, null, 0, choose_heuristic(start_coordinate, end_coordinate))
    let end_node = new Node(end_coordinate, null, 0, 0)

    open_list.push(start_node)

    if (obsticals.length > 0){
        for (let o = 0; o < obsticals.length; o++) {
            closed_list.push(new Node(obsticals[o], null, null, null))
        }
    }

    while(open_list.length){

        let current_node = find_lowest_f_value(open_list)

        if (current_node.current_coordinate[0] === end_node.current_coordinate[0] && current_node.current_coordinate[1] === end_node.current_coordinate[1]){

            open_l = open_list
            closed_l = closed_list

            let path = []
            let curr_node = current_node

            while(curr_node.parent_coord){
                path.push(curr_node.current_coordinate)
                curr_node = curr_node.parent_coord
            }
            path.push(start_node.current_coordinate)
            return path.reverse()
        }

        closed_list.push(current_node)
        open_list = remove_from_from_list(current_node, open_list)

        let neighbours = find_neighbours(current_node.current_coordinate, grid_size, grid_step)

        counter = 0

        for (let y = 0; y < neighbours.length; y++) {

            let n = new Node(neighbours[y], current_node, current_node.g_value + 1, choose_heuristic(neighbours[y], end_node.current_coordinate))

            if (check_if_in_closed_list(n.current_coordinate, closed_list)){
                counter += 1
                if (counter >= 4){
                    current_node = current_node.parent_coord
                }
                continue
            }

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

function generate_obsticals(coords, amount, start, end) {

    let obsticals = []

    for (let i = 0; i < amount; i++) {
        // select random coordinate
        let ob = coords[Math.floor(Math.random() * coords.length)]
        // check that is not the start/end coordinate
        while (ob[0] === start[0] && ob[1] === start[1] || ob[0] === end[0] && ob[1] === end[1]) {
            ob = coords[Math.floor(Math.random() * coords.length)]
        }

        // generate neightbours

        let neigh = find_neighbours(ob, grid_size, grid_step)
        for (let j = 0; j < neigh.length; j++) {
            for (let k = 0; k < obsticals.length; k++) {
                if (neigh[j] === obsticals[k]){
                    ob = coords[Math.floor(Math.random() * coords.length)]
                    amount +=1
                }
            }
        }
        obsticals.push(ob)

    }

    return obsticals

}


function draw_path(path, size, color){
    for (let i = 0; i < path.length; i++) {
        let curr = path[i]
        fill(79, 255, 255, 200)
        rect(curr[0], curr[1], size, size)


    }
}

function draw_obsticals(obsticals){

    for (let j = 0; j < obsticals.length; j++) {
        fill('black')
        rect(obsticals[j][0], obsticals[j][1], grid_step, grid_step)
    }
}

function draw_grid(coords){

    for (let i = 0; i < coords.length; i++) {

        // rect(coords[i][0], coords[i][1], grid_step, grid_step)
        // fill('white')

        coord = coords[i]

        if (test_path.includes(coord)){
            console.log("continue")
        }

        fill('white')
        rect(coord[0], coord[1], grid_step, grid_step)
        fill('black')
        textSize(grid_step / 4)

        let node = new Node(coord, null, null, null)

        h = choose_heuristic(coord, end_coordinate)

        text(h, coord[0] + (grid_step / 2), coord[1] + (grid_step / 2))


    }
}

function user_grid_square(user_x, user_y, coords) {

    for (let x = 0; x < coords.length; x++) {

        let current_coordinate = coords[x]

        if (user_x > current_coordinate[0] && user_x < (current_coordinate[0] + grid_step) && user_y > current_coordinate[1] && user_y < (current_coordinate[1] + grid_step)) {

            if (current_coordinate === start_coordinate || current_coordinate === end_coordinate) {
                continue
            }
            return current_coordinate

        }
    }
}

function draw_rect(coord, step, c){
    fill(c)
    rect(coord[0], coord[1], step, step)
}

function mouseClicked() {

    if (mouseX && mouseY) {

        let x = mouseX
        let y = mouseY
        let p = user_grid_square(x, y, coords)
        return p
    }

}

let num = 0
function on_random(){
    let grid_max = document.getElementById("grid_size").value
    let lim = Math.pow(Number(grid_max.slice(0, 2)), 2) / 3
    num = Math.round(Math.random() * lim)
    document.getElementById("obsticals").value = num
    obstical_amount = num
}

function onSubmit(){

    let btn = document.getElementById("submit")

    if (btn.innerText === "Search"){

        let g = document.getElementById("grid_size").value
        let obstacle_amount = document.getElementById("obsticals").value

        if (obstacle_amount > 0) {
            document.getElementById("obsticals").value = ""
            if (obstacle_amount > Math.pow(Number(g.slice(0, 2)), 2) / 3) {
                obstical_amount = Number(g.slice(0, 2))
            } else {
                obstical_amount = Number(obstacle_amount)
            }
        } else {
            num = 0
        }

        btn.innerText = "Reset"
        $("#grid_size").prop("disabled", true);
        $("#obstacle_amount").prop("disabled", true);

        step = 50
        step = step / Number(g.slice(0, 1))

        test_path = []
        test_open = []

        ra = 0
        startT = 0
        deltaT = 2000
        doit = false;

        resize(canvas_size, canvas_size)

        grid = new Grid(canvas_size, canvas_size, step)
        grid_size = grid.grid_size
        grid_step = grid.grid_step
        coords = grid.generate_coordiantes()

        start_algorithm = true

    } else {

        btn.innerText = "Search"
        $("#grid_size").prop("disabled", false);
        $("#obstacle_amount").prop("disabled", false);

        obsticals = []
        finished_path = undefined
        start_algorithm = false

        test_path = []
        test_open = []

        ra = 0
        startT = 0
        deltaT = 2000
        doit = false;

        resize(canvas_size, canvas_size)

        grid = new Grid(canvas_size, canvas_size, step)
        grid_size = grid.grid_size
        grid_step = grid.grid_step
        coords = grid.generate_coordiantes()

    }


}

function on_grid_resize(){

    let g = document.getElementById("grid_size").value
    step = 50
    step = step / Number(g.slice(0, 1))

    obstical_amount = 0

    grid = new Grid(canvas_size, canvas_size, step)
    grid_size = grid.grid_size
    grid_step = grid.grid_step
    coords = grid.generate_coordiantes()

    start_coordinate = coords[Math.floor(Math.random() * coords.length)]
    end_coordinate = coords[Math.floor(Math.random() * coords.length)]

    test_path = []
    test_open = []

    ra = 0
    startT = 500
    deltaT = 500
    doit = false;

    start_algorithm = false

    resize(canvas_size, canvas_size)

}

function resize(w, h) {
    resizeCanvas(w, h, false);
}

function on_diagonal(){

    let elem = document.getElementById("diagonal")

    if (elem.value === "false"){
        diagonal = true
        elem.value = "true"
    } else {
        diagonal = false
        elem.value = "false"
    }
}

function on_heuristic(){

    let elem  = document.getElementById("heuristic")
    let strUser = elem.options[elem.selectedIndex].value;
    if (strUser === "1"){
        manhatten = false
    } else {
        manhatten = true
    }
}

// lets do some cool animations

let ra = 0
let startT = 0
let deltaT = 500
let doit = false;

function myTimer() {
    if (millis() > startT + deltaT) {
        //reset timer
        startT = millis()
        // set doit to true, so we can run the code we want
        doit = true;
    }
}

let open_l
let closed_l

let grid
let grid_step
let grid_size
let coords

let canvas_size = 500
let step = 50

let obstical_amount = 0
let obsticals = []

let start_coordinate
let end_coordinate
let finished_path

let user_pos
let start_algorithm = false

let diagonal = false
let manhatten = false

// animation
let test_path = []
let test_open = []

// let w = window.innerWidth

function setup() {

    createCanvas(canvas_size, canvas_size).parent("sketch")
    background('white');

    // animation
    startT = millis();

    grid = new Grid(canvas_size, canvas_size, step)
    grid_step = grid.grid_step
    grid_size = grid.grid_size
    coords = grid.generate_coordiantes()

    start_coordinate = coords[Math.floor(Math.random() * coords.length)]
    end_coordinate = coords[Math.floor(Math.random() * coords.length)]

    while (end_coordinate === start_coordinate){
        end_coordinate = coords[Math.floor(Math.random() * coords.length)]
    }

}


function draw() {

    draw_grid(coords)

    if (start_algorithm){
        obsticals = generate_obsticals(coords, obstical_amount, start_coordinate, end_coordinate)
        finished_path = A_star(start_coordinate, end_coordinate, obsticals)
        start_algorithm = false
    }

    if (obsticals){
        draw_obsticals(obsticals)
    }

    if (obsticals && finished_path){
        // animation
        if (doit) {
            if (ra < finished_path.length - 2){
                ra++;
            }
            test_path.push(finished_path[ra])

            if (finished_path[ra] === start_coordinate || finished_path[ra] === end_coordinate) {
                doit = false
            }

        }

        myTimer();

        for (let i = 0; i < open_l.length; i++) {
            draw_rect(open_l[i].current_coordinate, grid_step, "grey")
        }

        for (let i = 0; i < closed_l.length; i++) {
            draw_rect(closed_l[i].current_coordinate, grid_step, "pink")
        }

        draw_path(test_path, grid_step,"blue")
        draw_obsticals(obsticals)

    }

    fill("yellow")
    rect(start_coordinate[0], start_coordinate[1], grid_step, grid_step)
    fill("red")
    rect(end_coordinate[0], end_coordinate[1], grid_step, grid_step)

    if (mouseIsPressed && !start_algorithm && !finished_path) {
        user_pos = mouseClicked()
    }

    if (user_pos !== undefined && !start_algorithm && !finished_path){
        if (euclidian_heuristic(user_pos, start_coordinate) <  euclidian_heuristic(user_pos, end_coordinate)){
            start_coordinate = user_pos
            draw_rect(start_coordinate, grid_step, "yellow")
        } else {
            end_coordinate = user_pos
            draw_rect(end_coordinate, grid_step, "red")
        }
    }
}





