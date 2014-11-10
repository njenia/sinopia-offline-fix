var fs = require('fs-extra');
var _ = require('lodash');
var request = require('urllib-sync').request;

var storageDir = process.argv[2];
console.log('operating on storage folder: ' + storageDir);

function downloadPackage(folder, distUrl, packageObj) {
    try {
        var res = request(packageObj._distfiles[distUrl].url, {
            timeout: 60000 * 10
        });
        fs.writeFileSync(storageDir + '/' + folder + '/' + distUrl, res.data);
        console.log('finished ' + distUrl);
        return true;
    } catch (err) {
        console.log('timeout!');
        return false;
    }
}

fs.readdir(storageDir, function (err, folders) {
    if (err) {
        console.log('error');
        return;
    }
    folders.forEach(function (folder) {
        fs.readdir(storageDir + '/' + folder, function (err, filesInModuleFolder) {
            if (err) {
                console.log('error');
                return;
            }
            if (filesInModuleFolder.length === 1) {
                var packageFilePath = storageDir + '/' + folder + '/' + filesInModuleFolder[0];
                fs.readJson(packageFilePath, function (err, packageObj) {
                    if (err) {
                        console.log('error reading file as package json: ' + filesInModuleFolder[0]);
                        return;
                    }
                    if (!packageObj._distfiles) {
                        console.log('no distfiles in package json of ' + folder);
                    } else {
                        for (var distUrl in packageObj._distfiles) {
                            console.log('downloading ' + packageObj._distfiles[distUrl].url );
                            var downloadSuccessful;
                            do {
                                downloadSuccessful = downloadPackage(folder, distUrl, packageObj);
                            } while (!downloadSuccessful);
                        }

                    }
                });
            }
        });
    });
});