//Classe que gera os planos (grids) XZ, XY, YZ

//Construtor
generateGrid = function(scene){
	//Parâmetros para serem usados nos métodos
	this.size = 200;
	this.gridOpacity = 0.5;
	this.ratio = 1;
	this.displayGroundXZ = true;
	this.displayGroundYZ = true;
	this.displayGroundXY = true;
	this.scene = scene;
	
	//Instancia o material (textura) dos planos para ser um grid (GridMaterial é uma extensão do Babylon)
	this.groundMaterial = new BABYLON.GridMaterial("this.groundMaterial", this.scene);
	this.groundMaterial.gridRatio = this.ratio;
	this.groundMaterial.backFaceCulling = false;
	this.groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	this.groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	this.groundMaterial.minorUnitVisibility = 0;
	this.groundMaterial.opacity = this.gridOpacity;

	//Cria os três planos e seta o material para ser grid (como se fosse uma textura)
	this.groundXZ = BABYLON.Mesh.CreateGround("groundXZ", this.size,
			this.size, 2, this.scene);
	this.groundXZ.material = this.groundMaterial;
	this.groundYZ = BABYLON.Mesh.CreateGround("groundYZ", this.size,
			this.size, 2, this.scene);
	this.groundYZ.material = this.groundMaterial;
	this.groundYZ.rotation.z = Math.PI / 2;
	this.groundXY = BABYLON.Mesh.CreateGround("groundXY", this.size,
			this.size, 2, this.scene);
	this.groundXY.material = this.groundMaterial;
	this.groundXY.rotation.x = -Math.PI / 2;
};

//Métod para aumentar e diminuir o tamanho dos planos, usado no dat.GUI
generateGrid.prototype.updateGrid = function() {
	this.groundXZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundYZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundXY.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.ratio = this.size/2000;
	console.log(this.ratio);
};

generateGrid.prototype.updateGridOpacity = function() {
	this.groundMaterial.opacity = this.gridOpacity;
};

generateGrid.prototype.updateRatio = function() {
	this.groundMaterial.gridRatio = this.ratio;
};

//Métod para exibir ou não o plano XZ, usado no dat.GUI
generateGrid.prototype.showGroundXZ = function() {
	if (this.displayGroundXZ == false)
		this.groundXZ.setEnabled(false);
	else 
		this.groundXZ.setEnabled(true);
};

//Métod para exibir ou não o plano YZ, usado no dat.GUI
generateGrid.prototype.showGroundYZ = function() {
	if (this.displayGroundYZ == false)
		this.groundYZ.setEnabled(false);
	else 
		this.groundYZ.setEnabled(true);
};

//Métod para exibir ou não o plano XY, usado no dat.GUI
generateGrid.prototype.showGroundXY = function() {
	if (this.displayGroundXY == false)
		this.groundXY.setEnabled(false);
	else 
		this.groundXY.setEnabled(true);
};
