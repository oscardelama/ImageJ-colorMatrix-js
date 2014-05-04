/**
Copyright 2014 Oscar de Lama.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/

importClass(Packages.java.awt.event.TextListener);

//--------------------------------------------------------------
// When declaring here (globally) these constants, they are 
// not seen by the following function. I don't understand why!
// Using an alternative escape for this weird situation:
var globalConstants =
"var "
// Validation constants
+ "VAL_CANCEL    = 0,"
+ "VAL_NO_ERROR  = 1,"
+ "VAL_ERROR     = 2,"
//Color index in arrays
+ "RED     = 0,"
+ "GREEN   = 1,"
+ "BLUE    = 2,"
// Plug-in version number
+ "VER_NBR = '1.0',"
// ID of script settings
+ "SETTINGS_KEY = 'odl_colorMatrix.set',"
// buildOutChannel() function result indices
+ "IMG_PLUS  = 0,"
+ "IMG_NAME  = 1;";
//--------------------------------------------------------------

// Run the colorMatrix script
colorMatrix();

/**
*  Returns the colorMatrix default parameter values
**/
function getDefaultOptions() {

  // Default dialog window arguments
  var factoryOptions =
    { outputFileName: "Output",
      outputFileFormat: "FITS",
      outputFileNameExt: ".fit",
      saveOutputChannels: false,
      keepOutputChannels: true,
      // outChannelAdu.max is used as divisor to map pixel values into [0,1]
      // before gamma correction. After applying gamma the pixel values are multiplied
      // by outChannelAdu.max to recover the original scale
      outChannelAdu: {min:0, max:16383},
      // gamma reciprocal value
      gamma: 2.2,
      outChannelSuffix: {red:"_r", green:"_g", blue:"_b"},
      colorMatrix: [[1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]]
    }

    // Try to retrieve last used options, if not possible use
    // factory default options
    return retrieveDlgArguments(factoryOptions) || factoryOptions;
}

function colorMatrix() {

  // define global constants
  eval(globalConstants);

  // Get default options
  var defOptions = getDefaultOptions();
  
  var wList = WindowManager.getIDList();
  //there are less than 2 images or no images
  if (null == wList || wList.length<2){
      IJ.showMessage("Error", "There must be at least two windows open");
      noImage();
      return;
  }

  //get all the image titles to show them in the dialog window
  var titles = new Array();

  for (var i=0, k=0; i<wList.length; i++) {
    var limp = WindowManager.getImage(wList[i]);
    if (limp)
      titles[k++] = limp.getTitle();
  }

/** Build the dialog window **/
  do {
    var gd = new GenericDialog("Color Matrix V"+VER_NBR);

    //--- RGB input Channel images
    gd.addMessage("Input color channels");
    gd.addChoice("Red_Channel :", titles, guessChannel(titles, "_r."));
    gd.addChoice("Green_Channel :", titles, guessChannel(titles, "_g."));
    gd.addChoice("Blue_Channel :", titles, guessChannel(titles, "_b."));

    //--- Output image channels options
    gd.addMessage("Output image options");
    // Output file name without extension, ".fit" will be used
    gd.addStringField("Output_image_file_name :", defOptions["outputFileName"]);
    gd.addCheckbox("Save_output_image_channels", defOptions["saveOutputChannels"]);
    gd.addCheckbox("Keep output channels", defOptions["keepOutputChannels"]);

    // Gamma (the reciprocal value)
    gd.addNumericField("Gamma :", defOptions["gamma"], 4);

    // Minimum and maximum ADU values allowed in output Channel
    // Values out of range will be clipped
    gd.addNumericField("Minimum output ADU :", defOptions["outChannelAdu"]["min"], 0);
    gd.addNumericField("Maximum output ADU :", defOptions["outChannelAdu"]["max"], 0);

  /* --- Color matrix scales  --*/
    //Number of digits for each scale in the color matrix
    const SCALE_DIGITS = 7;
    var arrColorMatrix = defOptions["colorMatrix"];

    // First scale field index
    var firstScaleFieldIx = 3;
    gd.addMessage("Paste here the whole color matrix");
    gd.addTextAreas("", null, 1, 20);
    var textColorMatrix = gd.getTextArea1();

    //-- Scales for output Red channel
    gd.addMessage("\nScales for output Red channel");
    gd.addNumericField("red.Red :", arrColorMatrix[RED][RED], SCALE_DIGITS);
    gd.addNumericField("red.Green :", arrColorMatrix[RED][GREEN], SCALE_DIGITS);
    gd.addNumericField("red.Blue :", arrColorMatrix[RED][BLUE], SCALE_DIGITS);
    // Get access to the Red scales input fields
    var inFieldRedRed = gd.getNumericFields().get(firstScaleFieldIx);
    var inFieldRedGreen = gd.getNumericFields().get(firstScaleFieldIx+1);
    var inFieldRedBlue = gd.getNumericFields().get(firstScaleFieldIx+2);

    //-- Scales for output Green channel
    gd.addMessage("\nScales for output Green channel");
    gd.addNumericField("green.Red :", arrColorMatrix[GREEN][RED], SCALE_DIGITS);
    gd.addNumericField("green.Green :", arrColorMatrix[GREEN][GREEN], SCALE_DIGITS);
    gd.addNumericField("green.Blue :", arrColorMatrix[GREEN][BLUE], SCALE_DIGITS);
    // Get access to the Green scales input fields
    var inFieldGreenRed = gd.getNumericFields().get(firstScaleFieldIx+3);
    var inFieldGreenGreen = gd.getNumericFields().get(firstScaleFieldIx+4);
    var inFieldGreenBlue = gd.getNumericFields().get(firstScaleFieldIx+5);

    //-- Scales for output Blue channel
    gd.addMessage("\nScales for output Blue channel");
    gd.addNumericField("blue.Red :", arrColorMatrix[BLUE][RED], SCALE_DIGITS);
    gd.addNumericField("blue.Green :", arrColorMatrix[BLUE][GREEN], SCALE_DIGITS);
    gd.addNumericField("blue.Blue :", arrColorMatrix[BLUE][BLUE], SCALE_DIGITS);
    // Get access to the Blue scales input fields
    var inFieldBlueRed = gd.getNumericFields().get(firstScaleFieldIx+6);
    var inFieldBlueGreen = gd.getNumericFields().get(firstScaleFieldIx+7);
    var inFieldBlueBlue = gd.getNumericFields().get(firstScaleFieldIx+8);

    // The text area allows to paste the whole color matrix
    textColorMatrix.addTextListener(new TextListener( {
      textValueChanged: function(evt) {
          var fldTxt = textColorMatrix.getText();
          log(fldTxt);
          if (fldTxt.contains("\n")) {
             log("Text area contains break line");
             var arrRows = fldTxt.split("\n", 3);
             if (arrRows[0]) inFieldRedRed.setText(arrRows[0]);
             if (arrRows[1]) inFieldGreenRed.setText(arrRows[1]);
             if (arrRows[2]) inFieldBlueRed.setText(arrRows[2]);
             //Clear the text area
             textColorMatrix.setText(null);
          }
      }
    }));

    // processing multi cell input for Red channel scales
    var redRowDigesting = false;
    inFieldRedRed.addTextListener(new TextListener( {
      textValueChanged: function(evt) {
          // Handle entry
          if (redRowDigesting) return;
          else redRowDigesting = true;

          var fldTxt = inFieldRedRed.getText();

          if ( fldTxt.contains("\t") ) {
             log("contains tab");
             var arrValues = fldTxt.split("\t");
             inFieldRedRed.setText(arrValues[0]);
             if (arrValues[1]) inFieldRedGreen.setText(arrValues[1]);
             if (arrValues[2]) inFieldRedBlue.setText(arrValues[2]);
          }
          redRowDigesting = false;
      }
    }));

    // processing multi cell input for Green channel scales
    var greenRowDigesting = false;
    inFieldGreenRed.addTextListener(new TextListener( {
      textValueChanged: function(evt) {
          // Handle entry
          if (greenRowDigesting) return;
          else greenRowDigesting = true;

          var fldTxt = inFieldGreenRed.getText();

          if ( fldTxt.contains("\t") ) {
             var arrValues = fldTxt.split("\t");
             inFieldGreenRed.setText(arrValues[0]);
             if (arrValues[1]) inFieldGreenGreen.setText(arrValues[1]);
             if (arrValues[2]) inFieldGreenBlue.setText(arrValues[2]);
          }
          greenRowDigesting = false;
      }
    }));

    // processing multi cell input for Blue channel scales
    var blueRowDigesting = false;
    inFieldBlueRed.addTextListener(new TextListener( {
      textValueChanged: function(evt) {
          // Handle entry
          if (blueRowDigesting) return;
          else blueRowDigesting = true;

          var fldTxt = inFieldBlueRed.getText();

          if (fldTxt.contains("\t")) {
             var arrValues = fldTxt.split("\t");
             inFieldBlueRed.setText(arrValues[0]);
             if (arrValues[1] ) inFieldBlueGreen.setText(arrValues[1]);
             if (arrValues[2]) inFieldBlueBlue.setText(arrValues[2]);
          }
          blueRowDigesting = false;
      }
    }));

    log("Show Dialog");
    gd.showDialog(); //show it
    log("Canceled?:" + gd.wasCanceled());
    if (gd.wasCanceled()) return;

  /**  Get the RGB input channel images **/
    // Get the Red image input channel
    var redChannelIx = gd.getNextChoiceIndex();
    var redChanImp = WindowManager.getImage(wList[redChannelIx]);
    // Get the Green image input channel
    var greenChannelIx = gd.getNextChoiceIndex();
    var greenChanImp = WindowManager.getImage(wList[greenChannelIx]);
    // Get the Blue image input channel
    var blueChannelIx = gd.getNextChoiceIndex();
    var blueChanImp = WindowManager.getImage(wList[blueChannelIx]);
    // All input channels in an array
    var inputChannels = [redChanImp, greenChanImp, blueChanImp];

  /** Get output options **/
    var options = defOptions;
    options["outputFileName"] = gd.getNextString();
    options["saveOutputChannels"] = gd.getNextBoolean();
    options["keepOutputChannels"] = gd.getNextBoolean();
    options["gamma"] = gd.getNextNumber() ;
    options["outChannelAdu"]["min"] = gd.getNextNumber() ;
    options["outChannelAdu"]["max"] = gd.getNextNumber() ;

  /** Get channel options **/
    // Red channel scales
    var redRedScale = gd.getNextNumber();
    var redGreenScale = gd.getNextNumber();
    var redBlueScale = gd.getNextNumber();
    var redScales = [redRedScale, redGreenScale, redBlueScale];
    log("redScales: " + redScales);

    // Green channel scales
    var greenRedScale = gd.getNextNumber();
    var greenGreenScale = gd.getNextNumber();
    var greenBlueScale = gd.getNextNumber();
    var greenScales = [greenRedScale, greenGreenScale, greenBlueScale];
    log("greenScales: " + greenScales);

    // Blue channel scales
    var blueRedScale = gd.getNextNumber();
    var blueGreenScale = gd.getNextNumber();
    var blueBlueScale = gd.getNextNumber();
    var blueScales = [blueRedScale, blueGreenScale, blueBlueScale];
    log("blueScales: " + blueScales);

/** Save current values as default values **/
    options["colorMatrix"] = [redScales, greenScales, blueScales];
    defOptions = options;

/** Validate user input values **/
    var validation = dlgParamsAreValid(options);
    log("Validation:" + validation);
    if (validation == VAL_CANCEL) return;
  }
  while (validation == VAL_ERROR);

  // Save the user inputs
  saveDlgArguments(options);

  log("begin processing...");

/** Processing the request **/
  var outRedChannel = buildOutChannel(inputChannels, options, "red");
  var outGreenChannel = buildOutChannel(inputChannels, options, "green");
  var outBlueChannel = buildOutChannel(inputChannels, options, "blue");

  // Revert the input channels
  for (var i=0; i<3; i++) {
    IJ.run(inputChannels[i], "Revert", "");
  }
  
  // Merge the channels into a stack
  IJ.run(outRedChannel[IMG_PLUS], "Merge Channels...",
                  "c1="+outRedChannel[IMG_NAME]+
                  " c2="+outGreenChannel[IMG_NAME]+
                  " c3="+outBlueChannel[IMG_NAME]+" create keep");
  // Get the composite handle
  var impStack = getImg("Composite");

  // Close the output channels if required
  if (!options["keepOutputChannels"]) {
    outRedChannel[IMG_PLUS].close();
    outGreenChannel[IMG_PLUS].close();
    outBlueChannel[IMG_PLUS].close();
  }

  // Build the RGB composite from the stack
  IJ.run(impStack, "Stack to RGB", "");
  // Close the stack
  // impStack.close(); // can we save it to 16 bit tiff?

  // Build the RGB composite
  var impCompoRGB = getImg("Composite (RGB)");
  impCompoRGB.setTitle(options["outputFileName"]);
  impCompoRGB.show();
}

/**
  Build an output channel
**/
function buildOutChannel(inChannels, options, color) {

  // define global constants
  eval(globalConstants);

  // Revert the input channels
  for (var i=0; i<3; i++) {
    IJ.run(inChannels[i], "Revert", "");
  }

  // Get the channel scales
  var scales;
  switch (color) {
    case "red":
      scales = options["colorMatrix"][RED];
      break;

    case "green":
      scales = options["colorMatrix"][GREEN];
      break;

    case "blue":
      scales = options["colorMatrix"][BLUE];
      break;
  }

  // Scale the input channels
  for (var i=0; i < 3; i++) {
    IJ.run(inChannels[i], "Multiply...", "value="+scales[i] );
  }

  // Add the three channels
  var imgCalc = new ImageCalculator();
  var redPlusGreenImp = imgCalc.run("Add create 32-bit", inChannels[0], inChannels[1]);
  var outChannel = imgCalc.run("Add create 32-bit", redPlusGreenImp, inChannels[2]);

  // Rename the output channel image
  var imageName = getFileName(options, color);

  // Renaming is allowed only if already it is open
  closeImage(imageName);
  outChannel.setTitle(imageName);

  // Clip out of range ADU values
  IJ.run(outChannel, "Min...", "value="+options["outChannelAdu"]["min"]);
  IJ.run(outChannel, "Max...", "value="+options["outChannelAdu"]["max"]);

  // Apply gamma correction
  if (options["gamma"] != 1) {
    IJ.run(outChannel, "Divide...", "value="+options["outChannelAdu"]["max"]);
    var gamma = 1/options["gamma"];
    // log("gamma:" + gamma);
    IJ.run(outChannel, "Gamma...", "value="+gamma);
    IJ.run(outChannel, "Multiply...", "value="+options["outChannelAdu"]["max"]);
  }

  // Set the proper title
  outChannel.setTitle(imageName);
  log("Image Name:" + imageName);

  // Save if required
  if (options["saveOutputChannels"])
    IJ.saveAs(outChannel, "FITS", imageName);

  // Return the created channel
  outChannel.show();
  return [outChannel, imageName];
}

/**
*  Validate the user input for the dialog parameters.
**/
function dlgParamsAreValid(options) {

  // define global constants
  eval(globalConstants);

  // Validate all the scales are valid numbers
  var arrColorMatrix = options["colorMatrix"];

  for(var row=0; row < 3; row++)
    for(var col=0; col < 3; col++)
      if (!isValidNumber(arrColorMatrix[row][col])) {
        log(arrColorMatrix[row][col]);
        return showInputError("Not valid numeric scale", "At least one of the scale values in the\ncolor matrix is not a valid numeric value.");
      }

  // Validate minimum and maximum values
  if (!isValidNumber(options["outChannelAdu"]["min"]))
    return showInputError("Illegal Min output ADU", "Minimum output ADU is not a valid\nnumeric value");

  if (!isValidNumber(options["outChannelAdu"]["max"]))
    return showInputError("Illegal Max output ADU", "Maximum output ADU is not a valid\nnumeric value");

  if (options["outChannelAdu"]["min"] >= options["outChannelAdu"]["max"])
    return showInputError("Illegal Min/Max values", "Minimum output ADU must be below\nthe maximum output ADU");

  // Validate gamma value
  if (options["gamma"] <= 0)
    return showInputError("Illegal gamma value", "Gamma must have a positive value");

  return VAL_NO_ERROR;
}

/**
*  Build image name from options
**/
function getFileName(options, color) {
  if (color)
    return options["outputFileName"]
                  + options["outChannelSuffix"][color]
                  + options["outputFileNameExt"];
  else
    return options["outputFileName"]
                  + options["outputFileNameExt"];
}

/**
* Validate if the given value is a valid number
*
* Numeric value 'NaN' is not allowed
**/
function isValidNumber(number) {
  if (typeof(number) != "number") {
    log("'"+number+"' is not a number, is type:"+typeof(number));
    return false;
  }

  if (Double.isNaN(number)) {
    log("'"+number+"' is NaN");
    return false;
  }

  return true;
}

/**
* Show input error
**/
function showInputError(title, msg) {

  // define global constants
  eval(globalConstants);
  
  var uInput = IJ.showMessageWithCancel(title, msg);
  log("showInputError:" + VAL_ERROR);
  return (uInput == true) ? VAL_ERROR : VAL_CANCEL;
}

/**
*  Find window title containing a given text
**/
function guessChannel(titles, suffix) {
  for(var i=0; i < titles.length; i++) {
    var title = titles[i];
    if (title.contains(suffix))
      return title;
  }
  titles[0];
}

/**
*  Close the image with the given name
**/
function closeImage(imageName) {
  var wList = WindowManager.getIDList();
  for (var i=0; i<wList.length; i++) {
    var imp = WindowManager.getImage(wList[i]);
    if (imp.getTitle() == imageName) {
      // IJ.run(limp, "Close");
      imp.close();
      return;
    }
  }
}

function getImg(imageName) {
  var wList = WindowManager.getIDList();
  for (var i=0; i<wList.length; i++) {
    var limp = WindowManager.getImage(wList[i]);
    if (limp.getTitle() == imageName) {
      return limp;
    }
  }

}
/**
*  A local encapsulation of IJ.log().
*
*  Allows to easily activate/deactivate all the logging.
**/
function log(txt) {
  // commented out for production version
  // IJ.log(txt);
}

/**
*  Save the user inputs in the colorMatrix dialog window.
*
*  Standard ImageJ commands "remember" your inputs in the dialog
*  window showed by the the command. This way, when you execute the
*  command again, the last set of used parameter values are shown in
*  the dialog. How can we do that in JS?
*
*  This function and the following one are a shell for such
*  required functionality.
**/
function saveDlgArguments(options) {
  // define global constants
  eval(globalConstants);
  var preferences = new Prefs();
  
  log("saveDlgArguments: Options:" + options);
  var strOptions = objToString(options);
  log("saveDlgArguments: strOptions:" + strOptions);
  preferences.set(SETTINGS_KEY, strOptions);
}

/**
*  Retrieve the last user inputs in the colorMatrix dialog window.
*
*  Please read previous function comments
**/
function retrieveDlgArguments(defOptions) {
  // define global constants
  eval(globalConstants);
  var preferences = new Prefs();
  
  var strDefaults = objToString(defOptions);
  var strOptions = preferences.get(SETTINGS_KEY, strDefaults);
  log("strOptions: '" + strOptions +"'");
  log("type of strOptions: " + typeof(strOptions));
  
  //cast strOptions to string    
  strOptions = strOptions + " ;";
  var arrValues = strOptions.split(/\s/);

  log("arrValues: '" + arrValues +"'");
  log("arrValues is array:" + Array.isArray(arrValues));
  
  var options = setObjValues([defOptions, arrValues])[0];
  return options;
}

/**
* Returns a list of space separated values contained 
* in an object.
*
* The object can contain another objects, arrays or elemental 
* data types.
*
* For example obj = {alfa:1, beta:['a', 'b', 'c'], kappa:{one:'one'}}
* will return "1 a b c one"
**/
function objToString(obj) {
  var s = "";
  log("objToString, Obj: " + obj);
  log("objToString, Type of Obj: " + typeof(obj));
   
  if (Array.isArray(obj))
    for(var i=0; i < obj.length; i++) {
      s = withTrailingSpace(s);
      s += objToString(obj[i]);
    }
  else if (typeof(obj) == "object"
           && !(obj instanceof String)
           && !(obj instanceof Number)
           && !(obj instanceof Boolean)
          )
    for(var key in obj) {
      s = withTrailingSpace(s);
      s += objToString(obj[key]) ;
    }
  else
    s += obj;

  return s;
}

/**
*  Assign the options values to the components
*  of the options object
**/
function setObjValues(objPlusArrVal) {
  var obj = objPlusArrVal[0];
  var arrVal = objPlusArrVal[1];
  
  log("ObjType:" + typeof(obj));
  log("arrVal:" + arrVal);
  
  if (Array.isArray(obj))
    for(var i=0; i < obj.length; i++) {
      var objPlusVals = setObjValues([obj[i], arrVal]);
      obj[i] = objPlusVals[0];
      arrVal = objPlusVals[1];
    }
  else if (typeof(obj) == "object") 
    for(var key in obj) {
      var objPlusVals = setObjValues([obj[key], arrVal]);
      obj[key] = objPlusVals[0];
      arrVal = objPlusVals[1];
    }
  else {
    var objType = typeof(obj);
    var val = arrVal.shift();
    switch (objType) {
      case "string": 
        obj = val;
        break;
        
      case "number":
        obj = parseFloat(val);
        break;
        
      case "boolean":
        obj = (val == "true") ? true : false;
        break;
        
      default:
        log( "Unexpected data type!!!");
        throw "Unexpected data type!!!";
        break;
     }
  }
  
  return [obj, arrVal];
}

/**
* Ensure the string argument has a trailing space
* when the string is not empty.
**/
function withTrailingSpace(s) {
  if (s == "")
    return s;
  else if (s.charAt(s.length-1) != " ")
    return s + " ";
  else
    return s;
}
