////Classe que altera a cor do background

controlBackground = function(scene){
	//Parâmetros que serao utilizados nos metodos (O colorString começa como a cor padrao do background do Babylon)
	this.scene = scene;
	this.colorString = "#33334D"
};

controlBackground.prototype.updateColor = function() {
	//Funcao para alterar cor do background = Funcao que transforma cor hexadecimal para padrão RGB
	this.scene.clearColor = new BABYLON.Color3.FromHexString(this.colorString);
};
