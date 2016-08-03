controlBackground = function(scene){
	this.scene = scene;
	this.colorString = "#33334D"
};

controlBackground.prototype.updateColor = function() {
	this.scene.clearColor = new BABYLON.Color3.FromHexString(this.colorString);
};
