// variaveis
var verticesArray = [];
var linkArray = [];
var keyWord = '[ARESTAS]';
var gui;
var scene;
var matrix = [];
var isXML = false;

function readFile(evt) {
	var file = evt.target.files[0];
	var name = file.name;
	var ext = name.replace(/^.*\./, '');
	
	if (ext === 'xml'){
		isXML = true;
		verticesArray = [];
		linkArray = [];
		if (file){
			var reader = new FileReader();
			reader.onload = function() {
				
				var parsed = new DOMParser().parseFromString(this.result, "text/xml");
				
				var nodes = Array.prototype.slice.call(parsed.querySelectorAll("node"));
				var nodeCol = ["id", "coordx", "coordy", "coordz", "r", "g", "b"];
				
				verticesArray = nodes.map(n => nodeCol.map(v => n.getAttribute(v)));
				
				var links = Array.prototype.slice.call(parsed.querySelectorAll("link"));
				var linkCol = ["origin", "destination", "r", "g", "b"];
				
				linkArray = links.map(m => linkCol.map(l => m.getAttribute(l)));
				
				update();
			}
			
			reader.readAsText(file);
		} else {
			alert("Failed");
		}
	} else {
		if (file) {
			isXML = false;
			matrix = [];
			var reader = new FileReader();
			var contents = 'empty';
			reader.onload = function(e) {
				contents = e.target.result;
				var pastKey = false;
				contents.split('\n').forEach(function(line, i) {
					if (pastKey) {
						var vals = line.trim().split(/\ +/);
						if (vals.length > 2) {
							matrix.push(vals);
						}
					}
					if (line.trim() === keyWord) {
						pastKey = true;
					}
				})
				update();
			}
			reader.readAsText(file);
		} else {
			alert("Failed");
		}
	}
}

document.getElementById('fileinput').addEventListener('change', readFile, false);

window.addEventListener('DOMContentLoaded', function() {
	update();
});

// get the canvas DOM element
var canvas = document.getElementById('renderCanvas');

// load the 3D engine
//var engine = new BABYLON.Engine(canvas, true);
var engine = new BABYLON.Engine(canvas, false,{ antialias: true, preserveDrawingBuffer: true, limitDeviceRatio:1.0, generateDepthBuffer: false, generateMipMaps: false, samplingMode: 2 },false);

//Função do DAT.GUI
var initGui = function(axis, grid, cluster, background){
	if (gui)
		gui.destroy();
	//Inicia
	gui = new dat.GUI();
	gui.domElement.style.marginTop = "50px";
	gui.domElement.style.marginRight = "-16px";
	
	//Cria uma pasta
	var folder = gui.addFolder('Axis Options');
	//Mantem a pasta aberta no inicio
	folder.open();
	//Adiciona à pasta as opções
	folder.add(axis, 'size', 10, 1000).name("Axis size").step(10).onChange(function(){
		axis.updateAxis();
	});
	folder.add(axis, 'displayAxisX').name("Show axis X").onChange(function(){
		axis.showAxisX();
	});
	folder.add(axis, 'displayAxisY').name("Show axis Y").onChange(function(){
		axis.showAxisY();
	});
	folder.add(axis, 'displayAxisZ').name("Show axis Z").onChange(function(){
		axis.showAxisZ();
	});

	//Cria outra pasta
	folder = gui.addFolder('Plane Options');
	//Mantem a pasta aberta no inicio
	folder.open();
	//Adiciona à pasta as opções
	folder.add(grid, 'size', 20, 2000).name("Plane size").step(20).onChange(function(){
		grid.updateGrid();
	});
	folder.add(grid, 'displayGroundXZ').name('Show XZ plane').onChange(function(){
		grid.showGroundXZ();
	});
	folder.add(grid, 'displayGroundYZ').name('Show YZ plane').onChange(function(){
		grid.showGroundYZ();
	});
	folder.add(grid, 'displayGroundXY').name('Show XY plane').onChange(function(){
		grid.showGroundXY();
	});
	folder.add(grid, 'gridOpacity', 0.05, 0.95).name('Grid Opacity').step(0.05).onChange(function(){
		grid.updateGridOpacity();
	});
	/*folder.add(grid, 'ratio', 0, 100).name('Grid Ratio').step(1).onChange(function(){
		grid.updateRatio();
	});*/

	//Cria outra pasta 
	folder = gui.addFolder('Cluster Options');
	folder.open();
	folder.add(cluster, 'sphereRadius', 2, 20).name("Sphere Radius").step(1).onChange(function(){
		cluster.updateSphere();
	});
	folder.add(cluster, 'cylinderRadius', 1, 10).name("Cylinder Radius").step(1).onChange(function(){
		cluster.updateCylinder();
	});
	folder.add(cluster, 'displayCylinder').name("Show Cylinders").onChange(function(){
		cluster.showCylinder();
	});

	//Cria outra pasta
	folder = gui.addFolder('Background Options');
	folder.open();
	folder.addColor(background, 'colorString').name("Background Color").onChange(function(){
		background.updateColor();
	});
}

function update() {
	//Função que cria a cena e retorna a mesma
	var createScene = function() {
		//Cria a cena
		scene = new BABYLON.Scene(engine);

		//Cria uma camera e seta a posição da mesma
		var camera = new BABYLON.ArcRotateCamera("camera1",
				Math.PI / 12, 5 * Math.PI / 20, 10 * Math.PI,
				BABYLON.Vector3.Zero(), scene);
		camera.setPosition(new BABYLON.Vector3(300, 200, 300));
		camera.wheelPrecision = 0.9;

		//Controle da camera
		camera.attachControl(canvas, false);

		//Cria a iluminação
		var light = new BABYLON.HemisphericLight('light1',
				camera.position, scene);
		light.specular = new BABYLON.Color3(0,0,0);
		
		//Chama as classes que desenham o eixo, grid e clusters
		var axis = new generateAxis(scene);
		var grid = new generateGrid(scene);
		if (isXML){
			var cluster = new generateClusterXML(scene, verticesArray, linkArray);
		} else { 
			var cluster = new generateCluster(scene, matrix);
		}
		var background = new controlBackground(scene);

		//Inicializa o dat.GUI
		initGui(axis, grid, cluster, background);

		//Retorna a cena
		return scene;
	}
	
	//Chama função que cria a cena
	scene = createScene();

	//Roda o loop de renderização
	engine.runRenderLoop(function() {
		scene.render();
	});

	//A janela/canvas faz um resize dependendo do tamanho da tela
	window.addEventListener('resize', function() {
		engine.resize();
	});
}
