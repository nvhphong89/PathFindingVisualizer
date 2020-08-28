
var dijkstraBtn = document.getElementById("Dijkstra");
var aStarBtn = document.getElementById("AStar");
var randomMazeBtn = document.getElementById("RandomMaze");
var recursiveMazeBtn = document.getElementById("RecursiveMaze");
var clearBoardBtn = document.getElementById("ClearBoard");

var width = 50;
var height = 20;
var numberOfNodes = width*height;
var G = new Array(numberOfNodes).fill(0).map(() => new Array(numberOfNodes).fill(0));
var dist = [];
var isVisited = [];

function sleep(ms = 10){
	return new Promise(resolve => setTimeout(resolve, ms));
}
function randomNumber(num){
	return Math.floor(Math.random()*num);
}

function initMatrix(graph){
	// initialize nodes matrix
	// set connections between nodes
	for (var i = 0; i < numberOfNodes; i++){
		if(i + width < numberOfNodes){
			graph[i][i+ width] = 1;	
		}
		if(i+1 < numberOfNodes && (i+1) % width !== 0){
			graph[i][i+1] = 1;
		}
	}
	for (var i = 0; i < numberOfNodes; i++){
		for (var j = i; j < numberOfNodes; j++){
			graph[j][i] = graph[i][j];
		}
	}
	// ADD EVENT LISTENERS FOR EACH NODE
	var prevClass;
	var prevNode;
	for (var i = 0; i < numberOfNodes; i++){
		var isDrawingBlocks = false;
		var isChangeSource = false;
		var isChangeDes = false;
		var element = document.getElementById(i);
		element.addEventListener("mousedown", function(){
			// handles drawing blocks
			if(this.classList.contains("unvisited")){
				this.classList.add("block");
				this.classList.remove("unvisited");	
				isDrawingBlocks = true;
			} 
			else if(this.classList.contains("block")){
				this.classList.add("unvisited");
				this.classList.remove("block");
					isDrawingBlocks = true;
			}
			// handles changing source node
			else if(this.classList.contains("source")){
			 	isChangeSource = true;
			}
			// handle changing des node
			else if(this.classList.contains("des")){
			 	isChangeDes = true;
			}
		});

		element.addEventListener("mouseenter", function(){
			// handles drawing blocks
			if(isDrawingBlocks){
				if(this.classList.contains("unvisited")){
					this.classList.add("block");
					this.classList.remove("unvisited");	
				} 
				else if(this.classList.contains("block")){
					this.classList.add("unvisited");
					this.classList.remove("block");
				}
			}
			// handles changing source node

			if(isChangeSource){
				if(!this.classList.contains("source")){
					prevClass = this.className;
					this.className = "";
					this.classList.add("source");
				} 
			}
			// handle changing des node
			if(isChangeDes){
				if(!this.classList.contains("des")){
					prevClass = this.className;
					this.className = "";
					this.classList.add("des");
				}
			}
		});

		element.addEventListener("mouseleave", function(){
			prevNode = this;
			if(isChangeSource){
				if(!this.classList.contains("des")){
				this.classList.remove("source");
				this.classList.add(prevClass);	
				}
			} 
			if(isChangeDes){
				this.classList.remove("des");
				this.classList.add(prevClass);
			}
		});
		element.addEventListener("mouseup", function(){
			isDrawingBlocks = false;
			isChangeSource = false;
			isChangeDes = false;
		});
	}
}

function dijkstraBtnClick(){
	dijkstraBtn.addEventListener("click", async function(){
		var srcNodeIdx;
		var desNodeIdx;
		// initialize dist array
		for (var i=0; i < numberOfNodes;i++){
			// init dist array
			var node = {
				g: Number.MAX_SAFE_INTEGER,
				prev: " ",
				isBlock: true
			}
			if(document.getElementById(i).className !== "block"){
				node.isBlock = false;
			}
			dist.push(node);
			// finding source node and des node
			if (document.getElementById(i).className == "source"){
				srcNodeIdx = i;
			}
			if (document.getElementById(i).className == "des"){
				desNodeIdx = i;
			}
		}
		// initialize isvisited
		isvisited = Array(numberOfNodes).fill(false);
		await dijkstra(srcNodeIdx, desNodeIdx);
	})
}

function minElement(isVisited, dist){
	var min = Number.MAX_SAFE_INTEGER;
	var minIdx = 0;
	for (var i = 0; i < numberOfNodes; i++){
		if (!isVisited[i] && dist[i].g < min){
			min = dist[i].g;
			minIdx = i;
		}
	}
	return minIdx;
}

async function dijkstra(srcIdx, desIdx){
	// set source element = 0 , starting point
	dist[srcIdx].g = 0;
	// loop through all nodes
	for (var i = 0; i < numberOfNodes; i++){
		// find closest non-visited element from source to visit next
		var v = minElement(isVisited, dist);
		isVisited[v] = true;
		if(v === desIdx){
			break;
		}
		// toggle visited node's class to green
		var currentElement = document.getElementById(v);
		if(!currentElement.classList.contains("source")){
			currentElement.classList.add("visited");	
		}
		await sleep();
		// loop through non-visited nodes
		for (var j = 0 ; j < numberOfNodes; j++){
			// if not block 
			//and not visited 
			//and have connection with current visit node v
			//and adjusting distance from source if need to
			if (!dist[j].isBlock && !isVisited[j] && G[v][j] > 0 && dist[j].g > dist[v].g + G[v][j]){
				// update short path to node j
				dist[j].g = dist[v].g + G[v][j];
				// update previous node to get to node j
				dist[j].prev = v;
			}
		}
		currentElement.classList.remove("unvisited");

	}
	// function to draw shortest path to des node from source
	await path(dist[desIdx].prev, srcIdx);
}

async function path(prev,srcIdx){
	if(prev === srcIdx){
		return true;
	}
	var res = await path(dist[prev].prev,srcIdx);
	if(res){
		document.getElementById(prev).className = '';
		document.getElementById(prev).classList.add("path");
		await sleep(30);	
	}
	return res;
}

function clearBoard(){
	for(var i=0; i < numberOfNodes; i++){
			var elem = document.getElementById(i);
			if(!(elem.classList.contains("source") || elem.classList.contains("des"))){
				elem.className = "";
				elem.classList.add("unvisited");	
			}
		}
		dist = [];
		isVisited = Array(numberOfNodes).fill(false);
}

function clearBoardBtnClick(){
	clearBoardBtn.addEventListener("click", function(){
		clearBoard();
	})
}

// GENERATING MAZE
function randomMaze(){
	for (var i=0;i< Math.floor(numberOfNodes/3);i++){
		var elem = document.getElementById(Math.floor(Math.random()*numberOfNodes));
		if(!(elem.classList.contains("source") || elem.classList.contains("des"))){
			elem.className = "";
			elem.classList.add("block");	
		}
	}
}

function randomMazeBtnClick(){
	randomMazeBtn.addEventListener("click", function(){
		clearBoard();
		randomMaze();
	})
}

async function recursiveMaze(x, y, w, h){ 	
	// x, y are coordinates where to start
	// w, h are width and height of the new grid after divided
	
	//condition to end recursion
	if(w <= 1 || h <= 1){
		return;
	}

	// finding direction to draw walls
	var direction;
	if (w < h){
		direction = "horizontal";
	} else if ( w > h){
		direction = "vertical";
	} else{
		Math.floor(Math.random()*2) == 0 ? "horizontal" : "vertical";
	}
	direction = w < h ? "horizontal": "vertical";
	//=========================
	// DRAWING WALLS
	//=========================
	// len: length of the walls
	// dx, dy: step to draw walls
	var len, dx, dy;
	len = direction == "horizontal" ? w : h;
	dx = direction == "horizontal" ? 1 : 0;
	dy = direction == "horizontal" ? 0 : 1;
	
	// finding coordinates to drawing walls
	var wx, wy;
	[wx, wy] = direction == "horizontal" ? [x, y + 1 + Math.floor(Math.random()*(h-2))] : [x+ 1 + Math.floor(Math.random()*(w-2)),y];
	// finding passage coordinates through each wall
	var px, py;
	[px,py] = direction == "horizontal" ? [wx + Math.floor(Math.random()*(w)), wy] : [wx, wy + Math.floor(Math.random()*(h))];

	for (var i = 0; i < len; i++){
		// if not passage then draw walls
		if((wy*width+wx) < 1000 && (wx != px || wy != py)){	
			var elem = document.getElementById(wy*width+wx);
			if(!(elem.classList.contains("source") || elem.classList.contains("des") || elem.classList.contains("passage"))){
				elem.className = "";
				elem.classList.add("block");
				await sleep(20);
			}
		} 
		// if passage then add class passage to passage node and 2 side nodes of that passage
		// doing this to make sure we have way to get through the maze
		else if (wx ==px || wy == py){ 
			if(direction == "horizontal"){
				var passages = [];
				passages.push(document.getElementById((wy-1)*width+wx));
				passages.push(document.getElementById(wy*width+wx));
				passages.push(document.getElementById((wy+1)*width+wx));
				passages.forEach(async function(passage){
					if(!(passage.classList.contains("source") || passage.classList.contains("des")|| passage.classList.contains("block"))){
					passage.className = "";
					passage.classList.add("passage");
					}	
				})
			} else {
				var passages = [];
				passages.push(document.getElementById(wy*width+wx-1));
				passages.push(document.getElementById(wy*width+wx));
				passages.push(document.getElementById(wy*width+wx+1));
				passages.forEach(async function(passage){
					if(!(passage.classList.contains("source") || passage.classList.contains("des")|| passage.classList.contains("block"))){
					passage.className = "";
					passage.classList.add("passage");
					}	
				})
			}
		}
		wx += dx;
		wy += dy;
	}
	// recursively divide the grid to make smaller maze walls and passages
	var nx,ny,nw,nh;
	[nx, ny] = [x, y];
	[nw, nh] = direction == "horizontal" ? [w, wy-y] : [wx-x, h];
	await recursiveMaze(nx, ny, nw, nh);
	[nx, ny] = direction == "horizontal" ? [x, wy+1] : [wx+1, y];
	[nw, nh] = direction == "horizontal" ? [w, y+h-wy-1] : [x+w-wx-1, h];
	await recursiveMaze(nx, ny, nw, nh);
}

function recursiveMazeBtnClick(){
	recursiveMazeBtn.addEventListener("click", async function(){
		clearBoard();
		// drawing boundary walls
		for (var i=0; i < numberOfNodes; i++){
			if ((0 < i && i < 50) || (950 < i) || (i%50 == 0) || ((i-49)%50 == 0)){
				var elem = document.getElementById(i);
				if(!(elem.classList.contains("source") || elem.classList.contains("des"))){
					elem.className = "";
					elem.classList.add("block");
					await sleep();
				}
			}
		}
		await recursiveMaze(1,1, width-2, height-2);
		for(var i = 0; i < numberOfNodes;i++){
			var elem = document.getElementById(i);
			if(elem.classList.contains("passage")){
				elem.className = "";
				elem.classList.add("unvisited");
			}
		}
	})
}

function aStarBtnClick(){
	aStarBtn.addEventListener("click", async function(){
		var srcNodeIdx;
		var desNodeIdx;
		// initialize dist array
		for (var i=0; i < numberOfNodes;i++){
			// init dist array
			var node = {
				g: Number.MAX_SAFE_INTEGER, //shortest distance from this node to source node
				h: Number.MAX_SAFE_INTEGER, // estimated distance from this node to des node
				prev: " ", // previous node to get to this node from source
				isBlock: true // is block node?
			}
			if(document.getElementById(i).className !== "block"){
				node.isBlock = false;
			}
			dist.push(node);
			// finding source node and des node
			if (document.getElementById(i).className == "source"){
				srcNodeIdx = i;
			}
			if (document.getElementById(i).className == "des"){
				desNodeIdx = i;
			}
		}
		// calculate h values
		var dx = desNodeIdx%width;
		var dy = Math.floor(desNodeIdx/width);
		for (var i=0; i < numberOfNodes; i++){
			var ix = i%width;
			var iy = Math.floor(i/width);
			//using Manhattan heusistic, if we're allowed to move in 4 directions
			dist[i].h = Math.abs(ix-dx) + Math.abs(iy-dy); 
		}
		// initialize isvisited
		isvisited = Array(numberOfNodes).fill(false);

		await aStar(srcNodeIdx, desNodeIdx);
	})
}

// function to find f of a node: f = g + h
function minFElement(isVisited, dist, srcIdx, desIdx){
	var minF = Number.MAX_SAFE_INTEGER;
	var minIdx = 0;
	for (var i = 0; i < numberOfNodes; i++){
		if (!isVisited[i] && (dist[i].g + dist[i].h) < minF){
			minF = dist[i].g + dist[i].h;
			minIdx = i;
		}
	}
	// there are maybe nodes having same h value
	// loop through those nodes and find node with min h
	var minH = Number.MAX_SAFE_INTEGER;
	for (var i = 0; i < numberOfNodes; i++){
		if(!isVisited[i] && (dist[i].g + dist[i].h == minF) && dist[i].h < minH){
				minH = dist[i].h;
				minIdx = i;
		}
	}
	return minIdx;
}

async function aStar(srcIdx, desIdx){
	// set source element = 0 , starting point
	dist[srcIdx].g = -1;
	// loop through all nodes
	for (var i = 0; i < numberOfNodes; i++){
		// find non-visited element that has min F to visit
		// F = shortest distance from source to v + estimated distance from v to des
		var v = minFElement(isVisited, dist, srcIdx, desIdx);
		isVisited[v] = true;
		
		// break if des node is found
		if(v === desIdx){
			break;
		}
		// toggle visited node's class to green
		var currentElement = document.getElementById(v);
		if(!currentElement.classList.contains("source")){
			currentElement.classList.add("visited");	
		}
		await sleep();
		// loop through non-visited nodes and find all non-visited nodes that have connections to v
		// and calculate their g (shortest distance from source)
		for (var j = 0 ; j < numberOfNodes; j++){
			// if not block 
			//and not visited 
			//and have connection with current visit node v
			//and adjusting distance from source if need to
			if (!dist[j].isBlock && !isVisited[j] && G[v][j] > 0 && dist[j].g > dist[v].g + G[v][j]){
				// update shortest distance from source to node j
				dist[j].g = dist[v].g + G[v][j];
				// update previous node to get to node j
				dist[j].prev = v;
			}
		}
		currentElement.classList.remove("unvisited");
	}
	// function to draw shortest path to des node from source
	await path(dist[desIdx].prev, srcIdx);
}

function init(){
	initMatrix(G);
	dijkstraBtnClick();
	aStarBtnClick();
	randomMazeBtnClick();
	clearBoardBtnClick();
	recursiveMazeBtnClick();
}

init();