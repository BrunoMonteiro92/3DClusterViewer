// variaveis
var matrix = [];
var keyWord = '[ARESTAS]';
var stats;

//Função para ler o arquivo
function readSingleFile(evt) {
	var f = evt.target.files[0];

	if (f) {
		var r = new FileReader();
		var contents = 'empty';
		r.onload = function(e) {
			contents = e.target.result;
			var pastKey = false;
			contents.split('\n').forEach(function(line, i) {
				if (pastKey) {
					var vals = line.trim().split(' ');
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
		r.readAsText(f);
	} else {
		alert("Failed");
	}
}

document.getElementById('fileinput').addEventListener('change', readSingleFile, false);

window.addEventListener('DOMContentLoaded', function() {
	update();
});

function update() {
	// get the canvas DOM element
	var canvas = document.getElementById('renderCanvas');

	// load the 3D engine
	var engine = new BABYLON.Engine(canvas, true);
	
	//Função que sobrescreve a função de câmera para que o zoom passe da origem sem inverter a mesma
	BABYLON.ArcRotateCamera.prototype._getViewMatrix = function() {
		// Compute
		var cosa = Math.cos(this.alpha);
		var sina = Math.sin(this.alpha);
		var cosb = Math.cos(this.beta);
		var sinb = Math.sin(this.beta);

		if (sinb === 0) {
			sinb = 0.0001;
		}
		
		var target = this._getTargetPosition();
		target.addToRef(new BABYLON.Vector3(this.radius * cosa * sinb,
				this.radius * cosb, this.radius * sina * sinb),
				this._newPosition);
		if (this.getScene().collisionsEnabled && this.checkCollisions) {
			this._collider.radius = this.collisionRadius;
			this._newPosition.subtractToRef(this.position,
					this._collisionVelocity);
			this._collisionTriggered = true;
			this.getScene().collisionCoordinator.getNewPosition(
					this.position, this._collisionVelocity,
					this._collider, 3, null,
					this._onCollisionPositionChange, this.uniqueId);
		} else {

			this.position.copyFrom(this._newPosition);
			var up = this.upVector;
			if (this.allowUpsideDown && this.beta < 0) {
				up = up.clone();
				up = up.negate();
			}

			if (this.radius < 0) {
				var vec = this.position.subtract(target);
				vec.normalize();

				BABYLON.Matrix.LookAtLHToRef(this.position,
						this.position.add(vec), up, this._viewMatrix);
			} else {
				BABYLON.Matrix.LookAtLHToRef(this.position, target, up,
						this._viewMatrix);
			}

			this._viewMatrix.m[12] += this.targetScreenOffset.x;
			this._viewMatrix.m[13] += this.targetScreenOffset.y;

		}
		return this._viewMatrix;
	};

	//Função que cria a cena e retorna a mesma
	var createScene = function() {
		//Cria a cena
		var scene = new BABYLON.Scene(engine);

		//Cria uma camera e seta a posição da mesma
		var camera = new BABYLON.ArcRotateCamera("camera1",
				Math.PI / 12, 5 * Math.PI / 20, 10 * Math.PI,
				new BABYLON.Vector3(100, 100, 100), scene);
		//Seta a camera para olhar para a origem
		camera.setTarget(BABYLON.Vector3.Zero());

		//Controle da camera
		camera.attachControl(canvas, false);

		//Cria a iluminação apontando para 0, 1, 0 (vindo do eixo y)
		var light = new BABYLON.HemisphericLight('light1',
				camera.position, scene);
		
		//Desenha os clusters
		var drawCluster = function(matrix) {
			for (var i = 0; i < matrix.length; i++) {
				//Seta a cor dos objetos
				var matObjects = new BABYLON.StandardMaterial(
						"matObjects", scene);
				matObjects.diffuseColor = new BABYLON.Color3(
						matrix[i][6], matrix[i][7], matrix[i][8]);

				//Desenha a esfera da ponta
				var sphereVertice = BABYLON.Mesh.CreateSphere(
						"sphereVertice", 20, 5, scene);
				sphereVertice.position = new BABYLON.Vector3(
						matrix[i][0], matrix[i][1], matrix[i][2]);
				sphereVertice.material = matObjects;

				//Desenha o centro do cluster
				var sphereCentro = BABYLON.Mesh.CreateSphere(
						"sphereCentro", 20, 5, scene);
				sphereCentro.position = new BABYLON.Vector3(
						matrix[i][3], matrix[i][4], matrix[i][5]);
				sphereCentro.material = matObjects;

				//Seta o ponto inicial e final do cilindro e calcula a distancia
				var vstart = sphereVertice.position;
				var vend = sphereCentro.position;
				var distance = BABYLON.Vector3.Distance(vstart, vend);

				//Desenha o cilindro
				var cylinder = BABYLON.Mesh.CreateCylinder("cylinder",
						distance, 2, 2, 36, scene);
				cylinder.material = matObjects;

				//Seta o pivo do cilindro para não ser no centro dele
				cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0,
						-distance / 2, 0));

				//Seta a posição do cilindro para a primeira esfera
				cylinder.position = sphereCentro.position;

				//Encontra e calcula o vetor entre as esferas
				var v1 = vend.subtract(vstart);
				v1.normalize();
				var v2 = new BABYLON.Vector3(0, 1, 0);

				//Faz um vetor perpendicular entre os dois vetores
				var axis = BABYLON.Vector3.Cross(v2, v1);
				axis.normalize();

				//Angulo entre os vetores
				var angle = BABYLON.Vector3.Dot(v1, v2);
				angle = Math.acos(angle);

				//Rotaciona o cilindro para ligar as duas esferas
				cylinder.rotationQuaternion = BABYLON.Quaternion
						.RotationAxis(axis, angle);
			}
		}
		
		var axis = new generateAxis(scene);
		var grid = new generateGrid(scene);
		drawCluster(matrix);

		//Inicializa o dat.GUI
		initGui(axis, grid);
		
		//Inicializa o Stats    
		stats = new Stats();
		stats.setMode( 1 );
		document.body.appendChild( stats.domElement );

		//Retorna a cena
		return scene;
	}
	
	//Função do dat.GUI
	var initGui = function(axis, grid){
		//Inicia
		var gui = new dat.GUI();
		//Cria uma pasta
		var folder = gui.addFolder('Axis options');
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
		folder = gui.addFolder('Plane options');
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
	}
	
	//Chama função que cria a cena
	var scene = createScene();

	//Roda o loop de renderização
	engine.runRenderLoop(function() {
		scene.render();
		stats.update();
	});

	//A janela/canvas faz um resize dependendo do tamanho da tela
	window.addEventListener('resize', function() {
		engine.resize();
	});
}
