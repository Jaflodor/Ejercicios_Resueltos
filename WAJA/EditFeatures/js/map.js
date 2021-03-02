var mapMain;
var widgetEditor;

// @formatter:off
require([
        "esri/map",

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/_base/array",

        "esri/dijit/editing/Editor",
        "esri/dijit/editing/TemplatePicker",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService",
        "esri/config",
        

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane"],
    function (Map,
              ready, parser, on, array, Editor, TemplatePicker, FeatureLayer, GeometryService, config,
              BorderContainer, ContentPane) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            /*
             * Step: Especificar la URL del proxy
             */
            config.defaults.io.proxyUrl = "http://localhost/proxy/proxy.ashx"


            // Create the map
            mapMain = new Map("divMap", {
                basemap: "osm",
                center: [-116.64, 34.37],
                zoom: 10
            });

            var flFirePoints, flFireLines, flFirePolygons;
            /*
             * Step: Construct the editable layers
             */
             var flFirePoints = new FeatureLayer ("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/0", {
                outFields: ['*']
             });
             var flFireLines = new FeatureLayer ("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/1", {
                outFields: ['*']
             });
             var flFirePolygons = new FeatureLayer ("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Wildfire/FeatureServer/2", {
                outFields: ['*']
             }); 


             /*Construimos el Geometry service*/

             var servicio_geometria= new GeometryService("http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/Geometry/GeometryServer")


            // Espere a que las capas editables terminen de cargarse
            mapMain.on("layers-add-result", initEditor);

            // Agregar las capas editables al mapa
            mapMain.addLayers([flFirePolygons, flFireLines, flFirePoints]);

            function initEditor(results) {

                // Mapear los resultados del evento en un array de objetos layerInfo
                var layerInfosWildfire = array.map(results.layers, function (result) {
                    return {
                        featureLayer: result.layer
                    };

                    
                });
                console.log(layerInfosWildfire)

                /*
                 * Step: Asignar los resultados del evento a un array de objetos Layer
                 */
                var layersWildfire = array.map(results.layers, function(result) {
                    return result.layer;
                  });
                
                  console.log(layersWildfire)



                /*
                 * Step: Añadir el TemplatePicker widget
                 */
                 var miniaturas_selector = new TemplatePicker ({
                    columns: "auto",
                    featureLayers: layersWildfire,
                    rows: "auto",
                    style: "height:1000px;"
                 }, "divLeft")

                 miniaturas_selector.startup();



                /*
                 * Step: Establecer la configuración del Editor widget
                 */
                 var settings = {
                                         
                    createOptions: {
                        polygonDrawTools: [Editor.CREATE_TOOL_POLYGON, Editor.CREATE_TOOL_FREEHAND_POLYGON],
                        polylineDrawTools: [Editor.CREATE_TOOL_POLYLINE, Editor.CREATE_TOOL_FREEHAND_POLYLINE],
                    },
                    geometryService: servicio_geometria,
                    layerInfos:layerInfosWildfire,
                    map: mapMain,
                    toolbarVisible: true,
                    toolbarOptions: {
                        cutVisible: true,
                        mergeVisible: true,
                        reshapeVisible: true
                    },
                    templatePicker: miniaturas_selector,                    
                    enableUndoRedo: true,
                    maxUndoRedoOperations: 15
                 }

                /*
                 * Step: Construir el primer parámetro del constructor del Editor
                 */
                var params = { settings: settings };

                /*
                 * Step: Construir el Editor widget
                 */
                 var editor_widget = new Editor (params, "divTop")

                 editor_widget.startup();




            };

            
            
        });
    });
