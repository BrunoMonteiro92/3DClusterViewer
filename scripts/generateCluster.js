generateCluster = function(scene, matrix){
	this.arrayOfSpheres=[];
	this.arrayOfCylinders=[];
	this.sphereRadius = 8;
	this.cylinderRadius = 4;
	this.scene = scene;
	this.displayCylinder = true;

	for (var i = 0; i < matrix.length; i++) {
		//Seta a cor dos objetos
		var matObjects = new BABYLON.StandardMaterial(
				"matObjects", this.scene);
		matObjects.diffuseColor = new BABYLON.Color3(
				matrix[i][6], matrix[i][7], matrix[i][8]);

		//Desenha a esfera da ponta
		this.sphereVertice = BABYLON.Mesh.CreateSphere(
				"sphereVertice", 20, this.sphereRadius, this.scene);
		this.sphereVertice.position = new BABYLON.Vector3(
				matrix[i][0], matrix[i][1], matrix[i][2]);
		this.sphereVertice.material = matObjects;

		this.arrayOfSpheres.push(this.sphereVertice);

		//Desenha o centro do cluster
		this.sphereCentro = BABYLON.Mesh.CreateSphere(
				"sphereCentro", 20, this.sphereRadius, this.scene);
		this.sphereCentro.position = new BABYLON.Vector3(
				matrix[i][3], matrix[i][4], matrix[i][5]);
		this.sphereCentro.material = matObjects;

		this.arrayOfSpheres.push(this.sphereCentro);

		//Seta o ponto inicial e final do cilindro e calcula a distancia
		var vstart = this.sphereVertice.position;
		var vend = this.sphereCentro.position;
		var distance = BABYLON.Vector3.Distance(vstart, vend);

		//Desenha o cilindro
		this.cylinder = BABYLON.Mesh.CreateCylinder("cylinder",
				distance, this.cylinderRadius, this.cylinderRadius, 36, this.scene);
		this.cylinder.material = matObjects;

		//Seta o pivo do cilindro para não ser no centro dele
		this.cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0,
				-distance / 2, 0));

		//Seta a posição do cilindro para a primeira esfera
		this.cylinder.position = this.sphereCentro.position;

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
		this.cylinder.rotationQuaternion = BABYLON.Quaternion
				.RotationAxis(axis, angle);

		this.arrayOfCylinders.push(this.cylinder);
	}

	//var groupSpheres = BABYLON.Mesh.MergeMeshes(arrayOfSpheres);
};

generateCluster.prototype.updateSphere = function(){
	for (var i = 0; i < this.arrayOfSpheres.length; i++){
		this.arrayOfSpheres[i].scaling = new BABYLON.Vector3(this.sphereRadius/8, this.sphereRadius/8, this.sphereRadius/8);
	}
};

generateCluster.prototype.updateCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		this.arrayOfCylinders[i].scaling = new BABYLON.Vector3(this.cylinderRadius/4, this.cylinderRadius/4, this.cylinderRadius/4);
	}
};

generateCluster.prototype.showCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		if (this.displayCylinder == false)
			this.arrayOfCylinders[i].setEnabled(false);
		else
			this.arrayOfCylinders[i].setEnabled(true);
	}
};
