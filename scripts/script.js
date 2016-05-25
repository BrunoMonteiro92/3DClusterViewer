// variaveis
var matrix = [];
var keyWord = '[ARESTAS]';

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
						console.log(matrix);
					}

				}
				if (line.trim() === keyWord) {
					pastKey = true;
				}

			})
			//document.getElementById("matriz").textContent = "" + matrix[0][0];
			update();
		}

		r.readAsText(f);
	} else {
		alert("Failed");
	}
}

document.getElementById('fileinput').addEventListener('change',
		readSingleFile, false);

//-----------------------------------------------------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', function() {
	update();
});

function update() {
	// get the canvas DOM element
	var canvas = document.getElementById('renderCanvas');

	// load the 3D engine
	var engine = new BABYLON.Engine(canvas, true);

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

	// createScene function that creates and return the scene
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

		var makeTextPlane = function(text, color) {
			var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", 512, scene, true);
			dynamicTexture.hasAlpha = true;
			dynamicTexture.drawText(text, null, 256, "20px Arial", color , "transparent", true);
			var plane = new BABYLON.Mesh.CreatePlane("TextPlane",  40, scene, true);
			plane.material = new BABYLON.StandardMaterial("TextPlaneMaterial", scene);
			plane.material.backFaceCulling = false;
			plane.material.specularColor = new BABYLON.Color3(0, 0, 0);
			plane.material.diffuseTexture = dynamicTexture;
			return plane;
		};

		var drawCluster = function(matrix) {
			for (var i = 0; i < matrix.length; i++) {
				//seta a cor dos objetos
				var matObjects = new BABYLON.StandardMaterial(
						"matObjects", scene);
				matObjects.diffuseColor = new BABYLON.Color3(
						matrix[i][6], matrix[i][7], matrix[i][8]);

				//desenha a esfera da ponta
				var sphereVertice = BABYLON.Mesh.CreateSphere(
						"sphereVertice", 20, 5, scene);
				sphereVertice.position = new BABYLON.Vector3(
						matrix[i][0], matrix[i][1], matrix[i][2]);
				sphereVertice.material = matObjects;

				var posSphere = new makeTextPlane(sphereVertice.position.x, "red");
				posSphere.position.x = sphereVertice.position.x;
				posSphere.position.y = parseFloat(sphereVertice.position.y) + 6;
				posSphere.position.z = sphereVertice.position.z;
				console.log(posSphere.position.y);

				//desenha o centro do cluster
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

				// Encontra e calcula o vetor entre as esferas
				var v1 = vend.subtract(vstart);
				v1.normalize();
				var v2 = new BABYLON.Vector3(0, 1, 0);

				//Faz um vetor perpendicular entre os dois vetores
				var axis = BABYLON.Vector3.Cross(v2, v1);
				axis.normalize();

				// Angulo entre os vetores
				var angle = BABYLON.Vector3.Dot(v1, v2);
				angle = Math.acos(angle);

				//Rotaciona o cilindro para ligar as duas esferas
				cylinder.rotationQuaternion = BABYLON.Quaternion
						.RotationAxis(axis, angle);
			}
		}

		//Instancia o material (textura) que os planos (grids) vão ter *Nota do B2: Isso é uma extensão do Babylon, eu chamei lá em cima junto com ele -> babylon.gridMaterial.min.js
		var groundMaterial = new BABYLON.GridMaterial("groundMaterial",
				scene);
		groundMaterial.gridRatio = 1;
		groundMaterial.backFaceCulling = false;
		groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
		groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
		groundMaterial.opacity = 0.9;

		var showGrid = function(size) {
			//Cria os três planos e seta o material para ser grid (como se fosse uma textura)
			var groundXZ = BABYLON.Mesh.CreateGround("groundXZ", size,
					size, 2, scene);
			groundXZ.material = groundMaterial;
			var groundYZ = BABYLON.Mesh.CreateGround("groundYZ", size,
					size, 2, scene);
			groundYZ.material = groundMaterial;
			groundYZ.rotation.z = Math.PI / 2;
			var groundXY = BABYLON.Mesh.CreateGround("groundXY", size,
					size, 2, scene);
			groundXY.material = groundMaterial;
			groundXY.rotation.x = -Math.PI / 2;
		}
		
		var axis = new showAxis(scene);
		//showGrid(1000);
		drawCluster(matrix);

		initGui(axis);
		return scene;
	}

	var initGui = function(axis){
		var gui = new dat.GUI();
		gui.add(axis, 'size', 10, 1000).name("Axis size").step(10).onChange(function(){
			axis.updateAxis();
		});
	}

	// call the createScene function
	var scene = createScene();

	// run the render loop
	engine.runRenderLoop(function() {
		scene.render();
	});

	// the canvas/window resize event handler
	window.addEventListener('resize', function() {
		engine.resize();
	});
}