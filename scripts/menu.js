var canvas = document.getElementById("renderCanvas");

var controlPanel = document.getElementById("controlPanel");
var fullscreen = document.getElementById("fullscreen");
var enableDebug = document.getElementById("enableDebug");
var divFps = document.getElementById("fpsLabel");

var engine = new BABYLON.Engine(canvas, true, { stencil: true });
var scene;

var panelIsClosed = true;
var clickableTag = document.getElementById("clickableTag");

if (clickableTag) {
    clickableTag.addEventListener("click", function () {
        if (panelIsClosed) {
            panelIsClosed = false;
            controlPanel.style.webkitTransform = "translateY(-30px)";
            controlPanel.style.transform = "translateY(-30px)";
        } else {
            panelIsClosed = true;
            controlPanel.style.webkitTransform = "translateY(100px)";
            controlPanel.style.transform = "translateY(100px)";
        }
    });
}

if (enableDebug) {
    enableDebug.addEventListener("click", function () {
        if (scene) {
            if (scene.debugLayer.isVisible()) {
                scene.debugLayer.hide();
            } else {
                scene.debugLayer.show();
            }
        }
    });
}

if (fullscreen) {
    fullscreen.addEventListener("click", function () {
        if (engine) {
            engine.switchFullscreen(true);
        }
    });
}

var renderFunction = function () {
    if (divFps) {
        // Fps
        divFps.innerHTML = engine.getFps().toFixed() + " FPS";
    }
};

engine.runRenderLoop(renderFunction);
