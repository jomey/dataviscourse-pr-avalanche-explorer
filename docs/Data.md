# Data

Below describes the steps taken to gather and generate required data

## Digital elevation model
The digital elevation model was downloaded from the Utah Automated 
Geographic Reference Center [AGRC](https://gis.utah.gov/data/elevation-and-terrain/)
at the 30m resolution for Little Cottonwood Canyon.

## UAC classes
The DEM was categorized with the avalanche rose and given a value 
following the table in the [UAC class document](data/uac_class.txt).

This step was based on classifying the DEM by 
[elevation band](data/elevation_class.txt) and 
[aspect class](data/aspect_class.txt) beforehand.

Last step after the UAC classes were generate on the raster was to 
['polygonize'](https://gdal.org/programs/gdal_polygonize.html)the data into 
GeoJson format.

The raster math given in the descriptions and all other processing steps can 
be executed via command line through [GDAL](https://gdal.org) or through 
a GIS GUI like [QGIS](https://www.qgis.org/en/site/).