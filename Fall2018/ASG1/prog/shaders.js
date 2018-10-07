/*var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' + 
    'void main() {\n' + 
    '  gl_Position = a_Position;\n' +                   // Coordinates                    
    '  gl_PointSize = 10.0;\n' +                        // Set the point size   
    '}\n';
    */
    


/*// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';;
  */



var VSHADER_SOURCE = 
    'attribute vec4 a_Position;\n' + 
    'attribute float a_PointSize;\n' + 
    'void main() {\n' +                   // Coordinates                    
    ' gl_Position = a_Position;\n' +
    ' gl_PointSize = a_PointSize;\n' + // Set the point size   
    '}\n';;

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';