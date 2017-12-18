//Classe que gera os clusters/grafos

generateClusterXML = function(scene, verticesArray, linkArray){
	var sphObjects;
	var cilObjects;
	var sphere;
	var cylinder;

	var vstart;
	var vend;
	var distance;

	var v1, v2;
	var axis;
	var angle;

	//Parâmetros para os demais métodos
	this.arrayOfSpheres=[];
	this.arrayOfCylinders=[];
	this.sphereRadius = 8;
	this.cylinderRadius = 4;
	this.scene = scene;
	this.displayCylinder = true;
	
	for (var i = 0; i < verticesArray.length; i++){
		sphObjects = new BABYLON.StandardMaterial(
				"matObjects", this.scene);
		sphObjects.diffuseColor = new BABYLON.Color3(
				verticesArray[i][4], verticesArray[i][5], verticesArray[i][6]);
		
		sphere = BABYLON.Mesh.CreateSphere(
				"sphereVertice" + i+1, 20, this.sphereRadius, this.scene);
		sphere.position = new BABYLON.Vector3(
				verticesArray[i][1], verticesArray[i][2], verticesArray[i][3]);
		sphere.material = sphObjects;
		
		this.arrayOfSpheres.push(sphere);	
	}
	
	for (var j=0; j < linkArray.length; j++){
		cilObjects = new BABYLON.StandardMaterial(
				"cilObjects", this.scene);
		cilObjects.diffuseColor = new BABYLON.Color3(
				linkArray[j][2], linkArray[j][3], linkArray[j][4]);
		
		idV = linkArray[j][0];
		idC = linkArray[j][1];
		vstart = new BABYLON.Vector3(
				verticesArray[idV-1][1], verticesArray[idV-1][2], verticesArray[idV-1][3]);
				
		vend = new BABYLON.Vector3(
				verticesArray[idC-1][1], verticesArray[idC-1][2], verticesArray[idC-1][3]);
		
		distance = BABYLON.Vector3.Distance(vstart, vend);
		
		cylinder = BABYLON.Mesh.CreateCylinder("cylinder",
				distance, this.cylinderRadius, this.cylinderRadius, 36, this.scene);
		cylinder.material = cilObjects;
		
		cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0,
				-distance / 2, 0));
				
		cylinder.position = new BABYLON.Vector3(
				verticesArray[idC-1][1], verticesArray[idC-1][2], verticesArray[idC-1][3]);
				
		v1 = vend.subtract(vstart);
 		v1.normalize();
		v2 = new BABYLON.Vector3(0, 1, 0);
		
		axis = BABYLON.Vector3.Cross(v2, v1);
		axis.normalize();
		
		angle = BABYLON.Vector3.Dot(v1, v2);
		angle = Math.acos(angle);
		
		cylinder.rotationQuaternion = BABYLON.Quaternion
 				.RotationAxis(axis, angle);
				
		this.arrayOfCylinders.push(cylinder);
	}
};

//Metodo para aumentar e diminuir o tamanho das esferas
generateClusterXML.prototype.updateSphere = function(){
	for (var i = 0; i < this.arrayOfSpheres.length; i++){
		this.arrayOfSpheres[i].scaling = new BABYLON.Vector3(this.sphereRadius/8, this.sphereRadius/8, this.sphereRadius/8);
	}
};

//Metodo para aumentar e diminuir o tamanho dos cilindros
generateClusterXML.prototype.updateCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		this.arrayOfCylinders[i].scaling.x = this.cylinderRadius/4;
		this.arrayOfCylinders[i].scaling.z = this.cylinderRadius/4;
	}
};

//Metodo para exibir ou nao os cilindros
generateClusterXML.prototype.showCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		if (this.displayCylinder == false)
			this.arrayOfCylinders[i].setEnabled(false);
		else
			this.arrayOfCylinders[i].setEnabled(true);
	}
};
