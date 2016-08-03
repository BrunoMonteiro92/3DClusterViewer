controlBackground = function(scene){
	this.scene = scene;
	this.colorString = "#000000"
	//this.color = BABYLON.Color3.FromHexString(this.colorString);
};

controlBackground.prototype.updateColor = function() {
	this.scene.clearColor = new BABYLON.Color3.FromHexString(this.colorString);
};