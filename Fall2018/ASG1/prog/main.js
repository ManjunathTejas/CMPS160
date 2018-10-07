/**
 * Function called when the webpage loads.
 */
function main() {
 // Retrieve <canvas> element
 var canvas = document.getElementById('example');
 var clearCanvasButton = document.getElementById('clearCanvas');
 var flag = false;
 var pointSize = document.getElementById('pointSizeSlider');
 var redSlider = document.getElementById('redSlider');
 var blueSlider = document.getElementById('blueSlider');
 var greenSlider = document.getElementById('greenSlider');
 // Get the rendering context for WebGL
 var gl = getWebGLContext(canvas);
 if (!gl) {
 console.log('Failed to get the rendering context for WebGL');
 return;
 }
 clearCanvasButton.onclick = function(){
     console.log('canvas cleared');
     gl.clear(gl.COLOR_BUFFER_BIT);
     g_points = [];
     g_size = [];
     g_colors= [];
     document.getElementById("location").innerHTML = "x:-.-- y:-.--";
 };
// Initialize shaders
if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
console.log('Failed to initialize shaders.');
return;
}

// Get the storage location of attribute variable
var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
 if (a_Position < 0){ 
      console.log('Failed to get the storage location of a_Position');
        return;
 }
  
// Get the storage location of attribute variable
var a_PointSize = gl.getAttribLocation(gl.program, 'a_PointSize');
 if (a_PointSize < 0){ 
      console.log('Failed to get the storage location of a_PointSize');
        return;
 }

// Get the storage location of attribute variable
var u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
 if (!u_FragColor){ 
      console.log('Failed to get the storage location of u_FragColor');
        return;
 }
    

 // Pass vertex position to attribute variable
//gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);
    
 // Specify the color for clearing <canvas>
 gl.clearColor(0.0, 0.0, 0.0, 1.0);
    
// Register function (event handler) to be called on a mouse press  
canvas.onmousedown = function(md) { flag = true;};
canvas.onmouseup = function(mu) { flag = false;}; 
canvas.onmousemove = function(ev) {
    if(flag){
        click(ev, gl, canvas, a_Position);
          
    }
};

// Clear <canvas>
gl.clear(gl.COLOR_BUFFER_BIT);   
var g_points = []; // The array for a mouse press
var g_size = [];
var g_colors = [];
function click(ev, gl, canvas, a_Position) {
    console.log('reached');
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();
    
    x = ((x - rect.left) - canvas.height/2)/(canvas.height/2);
    y = (canvas.width/2 - (y - rect.top))/(canvas.width/2);
    sendTextToHTML("x:" + x + "y:" + y, "location");
    // Store the coordinates to g_points array
    g_points.push(x); g_points.push(y);
    g_size.push(pointSize.value);
    g_colors.push([redSlider.value, greenSlider.value ,blueSlider.value,  1.0]);
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    var len = g_points.length;
    var j = 0;
    for(var i = 0; i < len; i+=2) {
        // Pass the position of  a point to a_Position variable
        gl.vertexAttrib3f(a_Position, g_points[i], g_points[i+1], 0.0);
        //console.log(a_PointSize);
        sendUniformFloatToGLSL(g_size[j], a_PointSize);
        //console.log(u_FragColor);
        sendUniformVec4ToGLSL(g_colors[j], u_FragColor);
        //gl.uniform4f(u_FragColor,g_colors[j]);
        
        // Draw a point
        gl.drawArrays(gl.POINTS, 0, 1);
        j++;
    }
}
}