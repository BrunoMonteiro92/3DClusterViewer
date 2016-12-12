//Classe que gera os clusters/grafos

generateCluster = function(scene, matrix){
	var matObjects;
	var sphereVertex;
	var sphereCenter;
	var cylinder;

	var vstart;
	var vend;
	var distance;

	var v1, v2;
	var axis;
	var angle;
	
	var tripleToString = function(x, y, z) {
        return Math.floor(x).toString(16) + Math.floor(y).toString(16) + Math.floor(z).toString(16);
    }

    var networks = {};
	
	for(var i = 0; i < matrix.length; i++) {
        var net = tripleToString(matrix[i][3], matrix[i][4], matrix[i][5]);
        if (!(net in networks)) {
            networks[net] = {};
            networks[net].center = new BABYLON.Vector3(matrix[i][3], matrix[i][4], matrix[i][5]);
            networks[net].color = new BABYLON.Color3(matrix[i][6], matrix[i][7], matrix[i][8]);
            networks[net].spurs = [];
        }
        networks[net].spurs.push(new BABYLON.Vector3(matrix[i][0], matrix[i][1], matrix[i][2]))
    }

	//Parâmetros para os demais métodos
	this.arrayOfSpheres=[];
	this.arrayOfCylinders=[];
	this.sphereRadius = 8;
	this.cylinderRadius = 4;
	this.scene = scene;
	this.displayCylinder = true;

	for (var net in networks) {
		//Seta a cor dos objetos
		matObjects = new BABYLON.StandardMaterial(
				"matObjects", this.scene);
		matObjects.diffuseColor = networks[net].color

        //Desenha o centro do cluster
		sphereCenter = BABYLON.Mesh.CreateSphere(
				"sphereCentro", 20, this.sphereRadius, this.scene);
		sphereCenter.position = networks[net].center;
		sphereCenter.material = matObjects;   

        //Armazena outra esfera num array de objetos
		this.arrayOfSpheres.push(sphereCenter);     

        for(var n = 0; n < networks[net].spurs.length; n++) {
		    //Desenha a esfera da ponta
		    sphereVertex = BABYLON.Mesh.CreateSphere(
				"sphereVertice", 20, this.sphereRadius, this.scene);
		    sphereVertex.position = networks[net].spurs[n]
		    sphereVertex.material = matObjects;

        
            //Armazena a esfera num array de objetos
		    this.arrayOfSpheres.push(sphereVertex);

		    //Seta o ponto inicial e final do cilindro e calcula a distancia
		    vstart = sphereVertex.position;
		    vend = sphereCenter.position;
		    distance = BABYLON.Vector3.Distance(vstart, vend);

		    //Desenha o cilindro
		    cylinder = BABYLON.Mesh.CreateCylinder("cylinder",
				distance, this.cylinderRadius, this.cylinderRadius, 36, this.scene);
	    	cylinder.material = matObjects;

		    //Seta o pivo do cilindro para não ser no centro dele
	    	cylinder.setPivotMatrix(BABYLON.Matrix.Translation(0,
				-distance / 2, 0));

		    //Seta a posição do cilindro para a primeira esfera
		    cylinder.position = sphereCenter.position;

		    //Encontra e calcula o vetor entre as esferas
		    v1 = vend.subtract(vstart);
		    v1.normalize();
		    v2 = new BABYLON.Vector3(0, 1, 0);

		    //Faz um vetor perpendicular entre os dois vetores
		    axis = BABYLON.Vector3.Cross(v2, v1);
		    axis.normalize();

		    //Angulo entre os vetores
		    angle = BABYLON.Vector3.Dot(v1, v2);
		    angle = Math.acos(angle);

		    //Rotaciona o cilindro para ligar as duas esferas
		    cylinder.rotationQuaternion = BABYLON.Quaternion
				.RotationAxis(axis, angle);

		    //Armazena os cilindros num array de objetos
		    this.arrayOfCylinders.push(cylinder);
        }
	}
};

//Metodo para aumentar e diminuir o tamanho das esferas
generateCluster.prototype.updateSphere = function(){
	for (var i = 0; i < this.arrayOfSpheres.length; i++){
		this.arrayOfSpheres[i].scaling = new BABYLON.Vector3(this.sphereRadius/8, this.sphereRadius/8, this.sphereRadius/8);
	}
};

//Metodo para aumentar e diminuir o tamanho dos cilindros
generateCluster.prototype.updateCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		this.arrayOfCylinders[i].scaling.x = this.cylinderRadius/4;
		this.arrayOfCylinders[i].scaling.z = this.cylinderRadius/4;
	}
};

//Metodo para exibir ou nao os cilindros
generateCluster.prototype.showCylinder = function(){
	for (var i = 0; i < this.arrayOfCylinders.length; i++){
		if (this.displayCylinder == false)
			this.arrayOfCylinders[i].setEnabled(false);
		else
			this.arrayOfCylinders[i].setEnabled(true);
	}
};
