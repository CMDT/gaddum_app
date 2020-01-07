(function () {
    'use strict';

    angular
        .module('app.db')
        .factory('mappingService', mappingService);

    mappingService.$inject = [
        'dbService',
        'utilitiesService'
    ];
    function mappingService(
        dbService,
        utilitiesService
    ) {

        var service = {

        };


        var FUNCTION_TO_SQL = null;

        var createFunctionToSQLMapping = function (index, pathToFunctionMappings, mappings, success, fail) {
            if (index < pathToFunctionMappings.length) {
                var pathToFunctionMapping = pathToFunctionMappings[index];
                index++;
                utilitiesService.readApplicationFileAsString(
                    pathToFunctionMapping.path,
                    function (content) {
                        if (content) {
                            if (content.length > 0) {
                                content = utilitiesService.strip(content);
                                mappings[pathToFunctionMapping.function] = content;
                            } else {
                                console.log("mappingService: readDefinition: definition has no content. " + definition.path);
                            }
                        } else {
                            console.log("mappingService: readDefinition: definition content is undefined. " + definition.path);
                        }
                        createFunctionToSQLMapping(index, pathToFunctionMappings, mappings, success, fail);
                    },
                    function (error) {
                        fail("read err: " + pathToFunctionMapping.path);
                    }
                );
            } else {
                success(mappings);
            }
        }

        var createFunctionToSqlMappings = function (pathToFunctionMappings, success, fail) {
            var result = {};
            if (pathToFunctionMappings && pathToFunctionMappings.length > 0) {
                var index = 0;
                createFunctionToSQLMapping(index, pathToFunctionMappings, result, success, fail);
            } else {
                success(result);
            }
        }




        function createFunctionName(path) {
            var result = null;

            var start = path.lastIndexOf('/') + 1;
            var end = path.lastIndexOf('.');
            if (start == -1) {
                start = 0;
            }

            if (end == -1) {
                end = path.length - 1;
            }


            result = path.substr(start, end - start);


            return result;
        }


        function createPathToFunctionMappings(pathArray) {
            var result = [];

            if (!(pathArray == null)) {
                pathArray.forEach(
                    function (path) {
                        var pathAsString = path.applicationPath;
                        var name = createFunctionName(pathAsString);
                        var item = {
                            function: name,
                            path: pathAsString
                        };
                        result.push(item);
                    }
                );
            }

            return result;
        }


        function createFunctionsFromSQLFiles(
            pathToSQLDir,
            success,
            fail
        ) {

            utilitiesService.readDir(
                pathToSQLDir,
                function (items) {
                    try {
                        var pathToFunctionMappings = createPathToFunctionMappings(items);
                    } catch (error) {
                        fail(error);
                    }

                    createFunctionToSqlMappings(
                        pathToFunctionMappings,
                        success,
                        fail
                    );

                },
                fail);
        };




        service.initialise = function (
            resourcePath,
            success,
            fail) {

            FUNCTION_TO_SQL = null;
            createFunctionsFromSQLFiles(
                resourcePath,
                function onSuccess(result) {
                    FUNCTION_TO_SQL = result;
                    success();
                },
                fail
            );

        }

        //PUBLIC
        service.getResponses = function (rows) {
            var result = [];
            for (var index = 0; index < rows.length; index++) {
                result.push(rows.item(index));
            }
            return result;
        };


        // Example format:
        // var result = [
        //     'CREATE TABLE IF NOT EXISTS DemoTable (name, score)',
        //     ['INSERT INTO DemoTable VALUES (?1,?2)', ['Alice', 101]],
        //     ['INSERT INTO DemoTable VALUES (?1,?2)', ['Betty', 202]],
        // ];
        function convertToPluginApiParams(queries) {
            var result = [];
            queries.forEach(function(query){

                //console.log("QUERY: FUNCTION: " + query.function);
                
                var sql = FUNCTION_TO_SQL[query.function];
                var params = query.params;

                result.push([sql,params]);

            });

            return result;
        }


        service.transaction = function (queries, success, fail) {

            if (!!queries) {

                var arg = convertToPluginApiParams(queries);

                dbService.transaction(
                    arg,
                    success,
                    fail
                );


            }
        }



        service.query = function (function_name, parameters, success, fail) {


            if (!function_name) { // catch undefined
                function_name = null;
            }
            if (!parameters) { // catch undefined
                parameters = null;
            }

            //console.log("QUERY: FUNCTION: " + function_name);



            var sql = FUNCTION_TO_SQL[function_name];

            executeSql(
                sql,
                parameters,
                function (response) {
                    success(response);
                },
                function (error) {
                    fail(error);
                });
        }






        function executeSql(sql, parameters, success, fail) {
            dbService.query(
                sql,
                parameters,
                function (result) {
                    success(result);
                },
                function (error) {
                    fail(error);
                }
            );
        }
        return service;
    }
})();