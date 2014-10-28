sinopia-offline-fix
===================

A fix for sinopia to download all missing tars to offline storage.

When using the [sinopia](https://github.com/rlidwka/sinopia) project for offline npm cache,
there is a bug that prevents you from using it as a real offline cache. Some packages does not
download, leaving the folder with only a package.json and no tarball. The bug is mentioned [here](https://github.com/rlidwka/sinopia/issues/98).

This script simply goes through the sinopia storage folders, and downloads the latest dist file
of these problematic packages.

Just take the app.js and package.json, run `npm install`, and run:
`node app.js STORAGE_FOLDER_PATH`
The missing tarballs will be downloaded.
