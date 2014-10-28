var fs = require('fs-extra');
var _ = require('lodash');
var http = require('http');

var storageDir = process.argv[2];
console.log('operating on storage folder: ' + storageDir);

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
                        var latestDistKey = _.findLastKey(packageObj._distfiles, function () {
                            return true;
                        });
                        var latestDistUrl = packageObj._distfiles[latestDistKey].url;
                        console.log('downloading ' + latestDistUrl);
                        var dstFile = fs.createWriteStream(storageDir + '/' + folder + '/' + latestDistKey);
                        http.get(latestDistUrl, function (response) {
                            response.pipe(dstFile);
                        });
                    }
                });
            }
        });
    });
});