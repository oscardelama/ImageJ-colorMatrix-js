colorMatrix
===========
colorMatrix is an [ImageJ](http://imagej.nih.gov/ij/) script that helps you to transform an image from one RGB color space to another one, this transformation is made with the use of a *color matrix*.

This tool has been created for the study and evaluation of such color matrices. This way, you can analyse the results from one *color matrix* isolated from additional adjustments that are done to the image &mdash;officially or "under the hood"&mdash; when you use that color matrix inside of a photo or image editing tool.

To find out the usage of JavaScript scripting in ImageJ [please check this ImageJ page](http://rsbweb.nih.gov/ij/developer/javascript.html).

What it does
-------------
The *colorMatrix* script gets as input three monochromatic images, with the same dimensions, representing the input red, green and blue channels (R<sup>s</sup>, G<sup>s</sup>, B<sup>s</sup>). *colorMatrix* also gets as input a 3x3 *color matrix*.  

In the following images, the symbols with blue color represent the information you will enter as input in the dialog window the script will show you.

![color matrix transformation](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/doc/img/colorMatrixTransformation.png)

The first step *colorMatrix* does is to apply the *color matrix* to the input channels in order to get intermediate RGB output channels (R<sup>d</sup>, G<sup>d</sup>, B<sup>d</sup>). Those intermediate output channels will have further processing as we shall see below.

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

By downloading colorMatrix you agree to the terms of use under Apache 2 License. Please check the [LICENSE](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE) file for more information.

  