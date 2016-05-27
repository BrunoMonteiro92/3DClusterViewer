generateGrid = function(scene){

	this.size = 200;
	
	var groundMaterial = new BABYLON.GridMaterial("groundMaterial", scene);
	groundMaterial.gridRatio = 1;
	groundMaterial.backFaceCulling = false;
	groundMaterial.mainColor = new BABYLON.Color3(1, 1, 1);
	groundMaterial.lineColor = new BABYLON.Color3(1.0, 1.0, 1.0);
	groundMaterial.opacity = 0.9;

	//Cria os três planos e seta o material para ser grid (como se fosse uma textura)
	this.groundXZ = BABYLON.Mesh.CreateGround("groundXZ", this.size,
			this.size, 2, scene);
	this.groundXZ.material = groundMaterial;
	this.groundYZ = BABYLON.Mesh.CreateGround("groundYZ", this.size,
			this.size, 2, scene);
	this.groundYZ.material = groundMaterial;
	this.groundYZ.rotation.z = Math.PI / 2;
	this.groundXY = BABYLON.Mesh.CreateGround("groundXY", this.size,
			this.size, 2, scene);
	this.groundXY.material = groundMaterial;
	this.groundXY.rotation.x = -Math.PI / 2;
};

generateGrid.prototype.updateGrid = function() {
	this.groundXZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundYZ.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
	this.groundXY.scaling = new BABYLON.Vector3(this.size/200, this.size/200, this.size/200);
}
