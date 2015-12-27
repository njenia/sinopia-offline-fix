var fs = require('fs-extra');
var _ = require('lodash');
var request = require('urllib-sync').request;

var storageDir = process.argv[2];
console.log('operating on storage folder: ' + storageDir);

function downloadPackage(folder, distUrl, packageObj) {
    try {
		var fp = storageDir + '/' + folder + '/' + distUrl;
		var exists = fs.existsSync(fp);
		if (exists) {
			console.log("Skipped, already exists.");
			return true;
		}
        var res = request(packageObj._distfiles[distUrl].url, {
            timeout: 60000 * 10
        });
	    fs.writeFileSync(storageDir + '/' + folder + '/' + distUrl, res.data);
        console.log('finished ' + distUrl);
        return true;
    } catch (err) {
        console.log('timeout:'+err);
        return false;
    }
}

fs.readdir(storageDir, function (err, folders) {
    if (err) {
        console.log('error:' + err);
        return;
    }
    folders.forEach(function (folder) {
        fs.readdir(storageDir + '/' + folder, function (err, filesInModuleFolder) {
            if (err) {
                console.log('error:'+err);
                return;
            }
            if (filesInModuleFolder.length > 0) {
                var packageFilePath = storageDir + '/' + folder + '/package.json';
                fs.readJson(packageFilePath, function (err, packageObj) {
                    if (err) {
                        console.log('error reading file as package json: ' + packageFilePath + ", error:"+err);
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
