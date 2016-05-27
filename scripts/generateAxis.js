generateAxis = function(scene){
	this.size = 100;
	this.displayAxisX = true;
	this.displayAxisY = true;
	this.displayAxisZ = true;
	this.scene = scene;

	this.axisX = BABYLON.Mesh.CreateLines("axisX", [
			BABYLON.Vector3.Zero(), 
			new BABYLON.Vector3(this.size, 0, 0) ], this.scene);
	this.axisX.color = BABYLON.Color3.Red();
	
	this.axisY = BABYLON.Mesh.CreateLines("axisY", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, this.size, 0) ], this.scene);
	this.axisY.color = BABYLON.Color3.Green();

	this.axisZ = BABYLON.Mesh.CreateLines("axisZ", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, 0, this.size) ], this.scene);
	this.axisZ.color = BABYLON.Color3.Blue();

};

generateAxis.prototype.updateAxis = function() {
	this.axisX.scaling.x = this.size/100;
	this.axisY.scaling.y = this.size/100;
	this.axisZ.scaling.z = this.size/100;
};

generateAxis.prototype.showAxisX = function() {
	if (this.displayAxisX == false)
		this.axisX.dispose();
	else {
		this.size = 100;
		this.axisX = BABYLON.Mesh.CreateLines("axisX", [
			BABYLON.Vector3.Zero(), 
			new BABYLON.Vector3(this.size, 0, 0) ], this.scene);
		this.axisX.color = BABYLON.Color3.Red();
	}
};

generateAxis.prototype.showAxisY = function() {
	if (this.displayAxisY == false)
		this.axisY.dispose();
	else {
		this.size = 100;
		this.axisY = BABYLON.Mesh.CreateLines("axisY", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, this.size, 0) ], this.scene);
		this.axisY.color = BABYLON.Color3.Green();
	}
};

generateAxis.prototype.showAxisZ = function() {
	if (this.displayAxisZ == false)
		this.axisZ.dispose();
	else {
		this.size = 100;
		this.axisZ = BABYLON.Mesh.CreateLines("axisZ", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, 0, this.size) ], this.scene);
		this.axisZ.color = BABYLON.Color3.Blue();
	}
};
