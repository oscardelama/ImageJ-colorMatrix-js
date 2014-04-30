colorMatrix
===========
colorMatrix is an [ImageJ](http://imagej.nih.gov/ij/) script that helps you to transform an image from one RGB color space to another one, this transformation is made with the use of a *color matrix*.

This tool has been created for the study and evaluation of such color matrices. This way, you can analyse the results from one *color matrix* isolated from additional adjustments that are done to the image &mdash;officially or "under the hood"&mdash; when you use that color matrix inside of a photo or image editing tool.

Install
-------

To find out the usage of JavaScript scripting in ImageJ [please check this ImageJ page](http://rsbweb.nih.gov/ij/developer/javascript.html).

To install the colorMatrix script, you just have to download it and drop it in the *plugins* folder under the *ImageJ* installation folder. The actual location of that folder in your computer depends on what did you chose during *ImageJ* installation. In the following section we will assume you installed *ImageJ* in the folder suggested by the installer. If that is not the case use the corresponding folder.

### Windows ###

On Windows OS the *plugin* folder is:

    C:\Program Files\ImageJ\plugins

However, to keep a tidy plugin folder structure we recommend you to create a new folder under the plugin one &mdash;for example RGB Scripts&mdash; and leave there the script. This way, at the end you will the have the script with this path:

    C:\Program Files\ImageJ\plugins\RGB Scripts\colorMatrix.js

### Linux ###

Follow the same steps as described for above for Windows. However, in Linux, the *ImageJ* plugin folder is in:

     /usr/local/ImageJ/plugin

### Mac OS X ###

Follow the same steps as described above for Windows. However, in Mac OS X, the *ImageJ* plugin folder is somewhere under (sorry, but I don't know exactly the default plugin folder location in Mac OS X):

    /Applications/ImageJ/
     
Usage
-----


License
-------

By downloading colorMatrix you agree to the terms of use under Apache 2 License. Please check the [LICENSE](https://github.com/oscardelama/ImageJ-colorMatrix-js/blob/master/LICENSE) file for more information.

  