'''
Attempts to automate generic part of creating a sketch

'''

import sys
from pathlib import Path


indexContent = """<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.3.1/p5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/5.0.0/math.min.js"></script>

    <meta charset="utf-8" />
    
    <style type="text/css">

      html, body {

        margin: 0;
        padding: 0;
      }

      canvas {

        display: block;
      }

    </style>

  </head>
  <body>
    <script src="sketch.js"></script>
  </body>
</html>
"""

sketchContent = """function setup () {
  createCanvas(400, 400);
}

function draw () {
  background(220);
}
"""


def genSketchFolder ( folderName, folderPath="" ):

	# Remove trailing slash if provided (hacky-ish)
	folderName = folderName.rstrip( "\\/" )
	folderPath = folderPath.rstrip( "\\/" )

	fullPath = "{}/{}/".format( folderPath, folderName )
	print( fullPath )

	# Create the folder
	# stackoverflow.com/a/273227
	try:

		Path( fullPath ).mkdir( parents=False, exist_ok=False )

	except FileNotFoundError:

		print( "parent folder does not exist - {}".format( folderPath ) )
		return

	except FileExistsError:

		print( "folder already exists - {}".format( fullPath ) )
		return

	# Create an 'index.html' file
	with open( "{}index.html".format( fullPath ), "w" ) as indexFile:

		indexFile.write( indexContent )

	# Create a simple 'sketch.js' file
	with open( "{}sketch.js".format( fullPath ), "w" ) as sketchFile:

		sketchFile.write( sketchContent )


if __name__ == "__main__":

	if len( sys.argv ) == 3:

		genSketchFolder( sys.argv[ 1 ], sys.argv[ 2 ] )

	elif len( sys.argv ) == 2:

		genSketchFolder( sys.argv[ 1 ] )

	else:

		print( "Usage: <folderName, [folderPath]>")
