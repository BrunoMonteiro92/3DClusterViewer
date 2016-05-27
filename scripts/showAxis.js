showAxis = function(scene){
	this.size = 100;
	this.displayAxisX = true;
	this.displayAxisY = true;
	this.displayAxisZ = true;

	this.axisX = BABYLON.Mesh.CreateLines("axisX", [
			BABYLON.Vector3.Zero(), 
			new BABYLON.Vector3(this.size, 0, 0) ], scene);
	this.axisX.color = BABYLON.Color3.Red();
	
	this.axisY = BABYLON.Mesh.CreateLines("axisY", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, this.size, 0) ], scene);
	this.axisY.color = BABYLON.Color3.Green();

	this.axisZ = BABYLON.Mesh.CreateLines("axisZ", [
			BABYLON.Vector3.Zero(),
			new BABYLON.Vector3(0, 0, this.size) ], scene);
	this.axisZ.color = BABYLON.Color3.Blue();

};

showAxis.prototype.updateAxis = function() {
	this.axisX.scaling.x = this.size/100;
	this.axisY.scaling.y = this.size/100;
	this.axisZ.scaling.z = this.size/100;
};
