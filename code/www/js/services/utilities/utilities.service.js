(function () {
    'use strict';

   

    angular
        .module('utilitiesjs')
        .factory('utilitiesService', utilitiesService);

    utilitiesService.$inject = [
        'moment'
    ];

    function utilitiesService(
        moment
    ) {

        var service = {

        };

        
        service.randomIntFromInterval = function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        service.createDateAsString = function () {

            var result = "\"" + moment().format('YYYY-MM-DD') + "\"";
            return result;
        };

        service.createDateTimeAsString = function () {

            var result = "\"" + moment().format('YYYY-MM-DD HH:mm:ss') + "\"";
            return result;
        };


        service.createDayAsString = function () {

            var result = "\"" + moment().format('dddd') + "\"";
            return result;
        };

        service.formatDateNoQuotes = function (date) {
            var result = moment(date).format('YYYY-MM-DD');
            return result;
        }

        service.formatDateTimeNoQuotes = function (date) {
            var result = moment(date).format('YYYY-MM-DD HH:mm:ss');
            return result;
        }


        service.formatDateAsString = function (date) {
            var result = "\"" + moment(date).format('YYYY-MM-DD') + "\"";
            return result;
        }

        service.formatDateTimeAsString = function (date) {
            var result = "\"" + moment(date).format('YYYY-MM-DD HH:mm:ss') + "\"";
            return result;
        }


        service.formatDayAsText = function (date) {
            var result = moment(date).format('dddd');
            return result;
        }

        service.createDayAsText = function () {

            var result = moment().format('dddd');
            return result;
        };

        var removeComments = function (sql) {
            sql = sql.replace(/("(""|[^"])*")|('(''|[^'])*')|(--[^\n\r]*)|(\/\*[\w\W]*?(?=\*\/)\*\/)/gm, function (match) {
                if (
                    (match[0] === '"' && match[match.length - 1] === '"')
                    || (match[0] === "'" && match[match.length - 1] === "'")
                ) return match;

                return '';
            });

            return sql;
        };

        var minify = function (sql) {

            sql = sql.replace(/("(""|[^"])*")|('(''|[^'])*')|([\t\r\n])/gm, function (match) {
                if (
                    (match[0] === '"' && match[match.length - 1] === '"')
                    || (match[0] === "'" && match[match.length - 1] === "'")
                ) return match;

                return ' ';
            });

            sql = sql.replace(/("(""|[^"])*")|('(''|[^'])*')|([ ]{2,})/gm, function (match) {
                if (
                    (match[0] === '"' && match[match.length - 1] === '"')
                    || (match[0] === "'" && match[match.length - 1] === "'")
                ) return match;

                return ' ';
            });

            return sql.trim();
        }

        service.removeComments = function (sql) {
            return removeComments(sql);
        }

        service.strip = function (sql) {
            return minify(removeComments(sql));
        };


        service.split = function (str) {

            var result = [];
            var array = str.split(new RegExp("\\s*;\\s*(?=([^']*'[^']*')*[^']*$)"));

            if (array) {
                for (var index = 0; index < array.length; index++) {
                    var item = array[index];
                    if ((item) && (item.length > 0)) {
                        result.push(item);
                    }
                }
            }

            return result;
        }


        service.fileExists = function (resourcePath) {
            var result = false;

            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + resourcePath,
                function (fileEntry) {
                    fileEntry.file(function (file) {
                        result = true;
                    });

                },
                function () {
                    result = false;
                }
            );

            return result;
        }

        service.readFileToJSONArray = function (resourcePath, success, fail) {
            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + resourcePath,
                function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();

                        reader.onloadend = function (arg) {

                            try {
                                var result = JSON.parse(this.result);
                                success(result);
                            } catch (e) {
                                fail();
                            }

                        }
                        reader.readAsText(file);
                    });

                },
                fail
            );
        };

        service.readFileToJSON = function (resourcePath, success, fail) {
            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + resourcePath,
                function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (arg) {

                            try {
                                var result = JSON.parse(this.result);
                                success(result);
                            } catch(error) {
                                fail(error);
                            }

                        }
                        reader.readAsText(file);
                    });

                },
                fail
            );
        };


        service.readDir = function (path, success, fail ){
            
            window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + path,
              function (fileSystem) {
                var reader = fileSystem.createReader();
                reader.readEntries(
                  function(entries){
                    entries.forEach(function(entry){
                        entry.applicationPath = path + "/" + entry.name;
                    });
                    success(entries);
                  },
                  fail
                );
              }, 
              fail
            );
          }

        service.convertStringToArray = function (arg1, fnSuccess, fnFail) {
            var candidate = arg1;
            var result = [];
            try {
                result = JSON.parse(candidate);
                fnSuccess(result);
            } catch (error) {
                fnFail(error);
            }
        }


        service.insertOrderable = function (orderable, arrOfOrderable) {

            var added = false;
            for (var i = 0, len = arrOfOrderable.length; i < len; i++) {
                if (orderable.order < arrOfOrderable[i].order) {
                    arrOfOrderable.splice(i, 0, orderable);
                    added = true;
                    break;
                }
            }
            if (!added) {
                arrOfOrderable.push(orderable);
            }



            return arrOfOrderable;
        }



        service.orderOrderable = function (arrOfOrderable) { // array of objects with 'order' property set.

            var result = [];
            var order = 0;

            for (var indexIn = 0; indexIn < arrOfOrderable; indexIn++) {
                var incoming = arrOfOrderable[indexIn];
                if (result.length == 0) {
                    result.push(incoming);
                } else {

                    for (var indexOut = 0; indexOut < result.length; indexOut++) {
                        var incumbent = result[indexOut];
                        if (incoming.order < incumbent.order) {
                            result.splice(indexOut, 0, incoming);
                            break;
                        }
                    }


                }


            }

            return result;

        }



        service.readApplicationFileAsString = function (path, success, fail) {

            window.resolveLocalFileSystemURL(
                cordova.file.applicationDirectory + path,
                function (fileEntry) {
                    fileEntry.file(function (file) {
                        var reader = new FileReader();
                        reader.onloadend = function (arg) {
                            success((this.result));
                        }
                        reader.readAsText(file);
                    });
                },
                fail
            );

        };

        service.dateToDay = function (yyyy_mm_dd) {
            /*
                takes date in yyyy_mm_dd format
                returns that day as an object. eg:
                {
                    name: 'Monday',
                    day_id: 1
                }
            */

            var date = null;
            if (yyyy_mm_dd instanceof Date) {
                date = yyyy_mm_dd;
            } else {
                //Put yyyy_mm_dd back into Date
                yyyy_mm_dd.replace("_", "-");
                date = new Date(yyyy_mm_dd);
            }

            var myDay_id = date.getDay();
            if (myDay_id == 0) { myDay_id += 7; }

            var myDayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][myDay_id - 1];


            return {
                name: myDayName,
                day_id: myDay_id
            }
        }


        var getKeys = function (obj) {
            var r = []
            for (var k in obj) {
                if (!obj.hasOwnProperty(k))
                    continue
                r.push(k)
            }
            return r
        }

        service.createUuid = function () {
            return uuid.v4();
        };




        return service;
    }
})();






