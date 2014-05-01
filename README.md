Welcome to colorMatrix
=======================
colorMatrix is an [ImageJ](http://imagej.nih.gov/ij/) script (*colorMatrix*)that helps you to transform an image from one RGB color space to another one. This transformation is made through the use of a *color matrix* given by you.

This tool has been created for the study and evaluation of such color matrices. This way, you can analyse the results from one *color matrix* isolated from additional adjustments that are done to the image &mdash;officially or "under the hood"&mdash; when you use that color matrix inside of a photo or image editing tool.

To find out the usage of JavaScript scripting in ImageJ [please check this ImageJ page](http://rsbweb.nih.gov/ij/developer/javascript.html).

Table of Contents
-----------------
- [What it does](#what-it-does)  
- [Usage](#usage)  
  * [Input color channels](input-color-channels)  
  * [Output Image Options](output-image-options)  
- [Installation](#installation)  
  * [Windows](#windows)  
  * [Linux](#linux)  
  * [Mac OS X](#mac-os-x)  
- [Contact](#contact)  
- [License](#license)  
----

What it does
-------------
The *colorMatrix* script gets as input three monochromatic images, with the same dimensions, representing the input red, green and blue channels (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>). *colorMatrix* also gets as input a 3x3 *color matrix*.  

In the following images, the symbols with blue color represent the information you will enter as input in the dialog window the script will show you.

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/colorMatrixTransformation.png "Color Matrix Transformation")

The first step *colorMatrix* does is apply your *color matrix* to the input channels in order to get intermediate RGB output channels (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>). Those intermediate output channels will have further processing before they are merged to build a RGB image, as is depicted with pseudo-code in the following picture. Remember the blue symbols are data you will input in *colorMatrix* dialog window. 

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/RangeAndGammaStepsPesudoCode.png "Range clipping & Gamma Correction seudo-Code")

After the color matrix transformation, each pixel value in each intermediate channel is check out to ensure if it is between a given minimum and maximum ADU values. If it is not, the pixel value is clipped to the minimum or maximum value correspondingly. 

Later, a [*Gamma Correction*](http://en.wikipedia.org/wiki/Gamma_correction) function is applied to each pixel value on each channel. This is an optional step, if the *gamma* parameter is equal to 1, this step is not executed at all. Notice the gamma value is specified with its reciprocal value, so to apply a *Gamma Correction* of `1/2.2` your input for the gamma value must be `2.2`. 

Before to apply the *Gamma Correction* the pixel values are taken to the `[0,1]` domain dividing the pixel value by the given maximum ADU value. After the gamma correction the pixel value is returned to its original domain by multiplying the result of the *Gamma Correction* by the given maximum ADU value.

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/finalStepsSeudoCode.png "Final steps seudo-code")

Finally, the intermediate channels are merged to build and show you the resulting RGB image.

Usage
-----

To run *colorMatrix* select the "colorMatrix" command from the corresponding *ImageJ* plugins menu option, the one you chose during the [script installation](#installation).

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/runColorMatrix.png "Launch colorMatrix")
 
*colorMatrix* will show you a dialog window where you can input the required parameters.

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/colorMatrixDialogWindow.png "colorMatrix dialog window")

### Input color channels ###

In this section you must define the monochromatic images that shall be used as input RGB channels. They are represented by (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>) [in the section "What it does"](#what-it-does). This images must have the same dimensions in order to have red, green and blue values for each pixel in the resulting image, which &mdash;of course&mdash; will have those common dimensions .

Before calling *colorMatrix*, you must have at least two images opened in *ImageJ*. You will probably want to have three images opened, one for each RGB input channel.

For the each of the "Red Channel", "Green Channel" and "Blue Channel" parameters you must select one of the opened images. 

*colorMatrix* will try to guess which of the opened images corresponds to each parameter and will show the dialog with those image titles selected as default values. The guessing is made by checking the image titles. If any of them contain the sub-strings "_r", "_g" or "_b" (for red, green and blue), it will be selected as the default image for the corresponding RGB channel. If there is no matching, *colorMatrix* will just select the first image in the *ImageJ* list of opened images. In any case, you can override this default selection and pick up the image you really want to use for each channel.

### Output Image Options ###

*   **Output image file name**: Is the title will have the resulting image.

*   **Save output image channels**: If this option is selected, each resulting channel will be saved. The "resulting channels" are those referred as (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>) in [the section "What it does"](#what-it-does) in their state at the end of the processing.

    This is useful because the final RGB composite image in *ImageJ* is unavoidable an 8-bit per channel image and you may have output channels with more precision you want to keep. 
    For example, if you have 14-bit input channels, you will have 14-bit output channels, and you may want the result of the process at that level of precision.
    
    If you don't select this options, *colorMatrix* anyway will ask you if is OK for you to close each of the resulting RGB image channels. This is an *ImageJ* behavior that can not be overrided.

Installation
-------------

To install *colorMatrix*, you just have to [download the latest version](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/master/colorMatrix.js) and drop it in the *plugins* folder under the *ImageJ* installation folder. The actual location of that folder in your computer depends on what did you chose during *ImageJ* installation. In the following section we will assume you installed *ImageJ* in the folder suggested by the installer. If that is not the case use the corresponding folder.

### Windows ###

On Windows OS the *plugin* folder path is:

    C:\Program Files\ImageJ\plugins

However, to keep a tidy *plugin* folder structure we recommend you to create a new folder under the plugin one &mdash;for example *RGB Scripts*&mdash; and drop there the script. This way, at the end you will the have the script with this full path:

    C:\Program Files\ImageJ\plugins\RGB Scripts\colorMatrix.js

### Linux ###

Follow the same steps as described for above for Windows. However, in Linux, the *ImageJ* plugin folder is in:

     /usr/local/ImageJ/plugin

### Mac OS X ###

Follow the same steps as described above for Windows. However, in Mac OS X, the *ImageJ* plugin folder is somewhere under (sorry, but I don't know exactly the default plugin folder location in Mac OS X):

    /Applications/ImageJ/
     

Contact
-------
Please feel free to contact me for any suggestion at &lt;my name&gt; `at` odeLama `dot` com. By the way, my name is Oscar.

License
-------

By downloading *colorMatrix* you agree to the terms of use under [Apache 2 License](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE.md). Please check the [LICENSE](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE.md) file for more information.

  