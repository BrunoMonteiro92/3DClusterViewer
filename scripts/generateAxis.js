//Classe que gera os eixos X, Y, Z

//Construtor
generateAxis = function(scene){
	//Parâmetros para os demais métodos
	this.size = 100;
	this.displayAxisX = true;
	this.displayAxisY = true;
	this.displayAxisZ = true;
	this.scene = scene;
	
	//Desenha eixo X
	this.axisX = BABYLON.Mesh.CreateLines("axisX", [
			BABYLON.Vector3.Zero(), 
			new BABYLON.Vector3(this.size, 0, 0) ], this.scene);
	//Na cor vermelha
	this.axisX.color = BABYLON.Color3.Red();
	
	//Desenha eixo Y
	this.axisY = BABYLON.Mesh.CreateLines("axisY", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, this.size, 0) ], this.scene);
	//Na cor verde
	this.axisY.color = BABYLON.Color3.Green();
	
	//Desenha eixo Z
	this.axisZ = BABYLON.Mesh.CreateLines("axisZ", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, 0, this.size) ], this.scene);
	//Na cor azul
	this.axisZ.color = BABYLON.Color3.Blue();

};

//Métod para aumentar e diminuir os eixos, usado no dat.GUI
generateAxis.prototype.updateAxis = function() {
	this.axisX.scaling.x = this.size/100;
	this.axisY.scaling.y = this.size/100;
	this.axisZ.scaling.z = this.size/100;
};

//Métod para exibir ou não o eixo X, usado no dat.GUI
generateAxis.prototype.showAxisX = function() {
	if (this.displayAxisX == false)
		this.axisX.setEnabled(false);
	else 
		this.axisX.setEnabled(true);
};

//Métod para exibir ou não o eixo Y, usado no dat.GUI
generateAxis.prototype.showAxisY = function() {
	if (this.displayAxisY == false)
		this.axisY.setEnabled(false);
	else 
		this.axisY.setEnabled(true);
};

//Métod para exibir ou não o eixo Z, usado no dat.GUI
generateAxis.prototype.showAxisZ = function() {
	if (this.displayAxisZ == false)
		this.axisZ.setEnabled(false);
	else 
		this.axisZ.setEnabled(true);
};
