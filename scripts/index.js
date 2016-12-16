var canvas = document.getElementById("renderCanvas");

var fullscreen = document.getElementById("fullscreen");
var divFps = document.getElementById("fpsLabel");

var engine = new BABYLON.Engine(canvas, true, { stencil: true });


if (fullscreen) {
    fullscreen.addEventListener("click", function () {
        if (engine) {
            engine.switchFullscreen(true);
        }
    });
}

var renderFunction = function () {
    if (divFps) {
        divFps.innerHTML = engine.getFps().toFixed() + " FPS";
    }
};

engine.runRenderLoop(renderFunction);
