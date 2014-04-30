colorMatrix
===========
colorMatrix is an [ImageJ](http://imagej.nih.gov/ij/) script that helps you to transform an image from one RGB color space to another one. This transformation is made through the use of a *color matrix* given by you.

This tool has been created for the study and evaluation of such color matrices. This way, you can analyse the results from one *color matrix* isolated from additional adjustments that are done to the image &mdash;officially or "under the hood"&mdash; when you use that color matrix inside of a photo or image editing tool.

To find out the usage of JavaScript scripting in ImageJ [please check this ImageJ page](http://rsbweb.nih.gov/ij/developer/javascript.html).

What it does
-------------
The *colorMatrix* script gets as input three monochromatic images, with the same dimensions, representing the input red, green and blue channels (R<sub>s</sub>, G<sub>s</sub>, B<sub>s</sub>). *colorMatrix* also gets as input a 3x3 *color matrix*.  

In the following images, the symbols with blue color represent the information you will enter as input in the dialog window the script will show you.

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/colorMatrixTransformation.png)

The first step *colorMatrix* does is apply your *color matrix* to the input channels in order to get intermediate RGB output channels (R<sub>d</sub>, G<sub>d</sub>, B<sub>d</sub>). Those intermediate output channels will have further processing before they are merged to build a RGB image, as is depicted with pseudo-code in the following picture. Remember the blue symbols are data you will input in *colorMatrix* dialog window. 

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/RangeAndGammaStepsPesudoCode.png)

After the color matrix transformation, each pixel value in each intermediate channel is check out to ensure if it is between a given minimum and maximum ADU values. If it is not, the pixel value is clipped to the minimum or maximum value correspondingly. 

Later, a [*Gamma Correction*](http://en.wikipedia.org/wiki/Gamma_correction) function is applied to each pixel value on each channel. This is an optional step, if the *gamma* parameter is equal to 1, this step is not executed at all. Notice the gamma value is specified with its reciprocal value, so to apply a *Gamma Correction* of `1/2.2` your input for the gamma value must be `2.2`. 

Before to apply the *Gamma Correction* the pixel values are taken to the `[0,1]` domain dividing the pixel value by the given maximum ADU value. After the gamma correction the pixel value is returned to its original domain by multiplying the result of the *Gamma Correction* by the given maximum ADU value.

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/finalStepsSeudoCode.png)

Finally, the intermediate channels are merged to build and show you the resulting RGB image.

Usage
-----

To run *colorMatrix* select the "colorMatrix" command from the corresponding *ImageJ* plugins menu option, according to where did you choose [install the script installation](#installation).

![image](https://github.com/oscardelama/ImageJ-colorMatrix-js/raw/master/doc/img/runColorMatrix.png)



Installation
-------------

To install the colorMatrix script, you just have to download it and drop it in the *plugins* folder under the *ImageJ* installation folder. The actual location of that folder in your computer depends on what did you chose during *ImageJ* installation. In the following section we will assume you installed *ImageJ* in the folder suggested by the installer. If that is not the case use the corresponding folder.

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
     
Usage
-----

Contact
-------
Please feel free to contact me for any suggestion at <my name> `at` odeLama `dot` com, where my name is Oscar.

License
-------

By downloading colorMatrix you agree to the terms of use under [Apache 2 License](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE.md). Please check the [LICENSE](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE.md) file for more information.

  