// @formatter:off
require([
        "esri/map",
        "esri/layers/ArcGISDynamicMapServiceLayer",
        "esri/layers/FeatureLayer",

        "esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleMarkerSymbol",
        "esri/Color",

        "esri/renderers/ClassBreaksRenderer",
        "esri/layers/LayerDrawingOptions",
        "esri/renderers/UniqueValueRenderer",
        

        "dojo/ready",
        "dojo/parser",
        "dojo/on",
        "dojo/dom",


        "dojo/_base/declare",
        "dojo/_base/array",

        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button"],
    function (Map, ArcGISDynamicMapServiceLayer, FeatureLayer,
              SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, Color, ClassBreaksRenderer, LayerDrawingOptions, UniqueValueRenderer,
              ready, parser, on, dom,
              declare, array,
              BorderContainer, ContentPane, Button) {
// @formatter:on

        // Wait until DOM is ready *and* all outstanding require() calls have been resolved
        ready(function () {

            // Parse DOM nodes decorated with the data-dojo-type attribute
            parser.parse();

            // URL variables
            var sUrlUSAService = "https://sampleserver6.arcgisonline.com/arcgis/rest/services/USA/MapServer";
            var sUrlQuakesLayer = "https://services.arcgis.com/ue9rwulIoeLEI9bj/arcgis/rest/services/Earthquakes/FeatureServer/0";

            // Create the map
            var mapMain = new Map("divMap", {
                basemap: "osm",
                center: [-119.65, 36.87],
                zoom: 4
            });

            // Construct and wire a button to apply the renderer
            mapMain.on("layers-add-result", function () {
                var btnApplyRenderer = new Button({
                    label: "Show County Population Density",
                    onClick: changeCountiesRenderer
                }, "progButtonNode");

                //update earthquakes using a renderer
                changeQuakesRenderer();

            });


            // Construct the USA layer
            var capa_dinamica = new ArcGISDynamicMapServiceLayer(sUrlUSAService, {
                opacity: 0.5
            });
            capa_dinamica.setVisibleLayers([0, 1, 3]);


            var outFieldsQuakes = ["EQID", "UTC_DATETIME", "MAGNITUDE", "PLACE"];

            // Construct the Quakes layer
            var capa_terremotos = new FeatureLayer(sUrlQuakesLayer, {
                outFields: outFieldsQuakes


            });
            capa_terremotos.setDefinitionExpression("MAGNITUDE >= 2.0");
            mapMain.addLayers([capa_dinamica, capa_terremotos]);


            function changeQuakesRenderer() {

                // construct a  symbol for earthquake features
                var quakeSymbol = new SimpleMarkerSymbol();
                quakeSymbol.setColor(new Color([255, 0, 0, 0.5]));
                quakeSymbol.setOutline(null);

                
                /*Step: Construct and apply a simple renderer for earthquake features*/
                 

                var renderer_quakes = new UniqueValueRenderer (quakeSymbol)

                capa_terremotos.setRenderer(renderer_quakes)


                
                /*Step: Construct symbol size info parameters for the quake renderer*/
                 
                var sizeInfo = renderer.setVisualVariables ([{

                    field: "MAGNITUDE",
                    minSize: 1,
                    maxSize: 50,
                    minDataValue:0,
                    maxDataValue:9,
                    type: "sizeInfo",
                    valueUnit: "unknown"
                    }])                      


                
                /*Step: Apply symbol size info to the quake renderer*/

                renderer_quakes.setSizeInfo(sizeInfo)
            }


            function changeCountiesRenderer() {

                var symDefault = new SimpleFillSymbol().setColor(new Color([89, 255, 0]));

                /*Step: Construir el renderizador de clases */
                    var renderer_counties = new ClassBreaksRenderer (symDefault, "pop00_sqmi")


                /* Step: Definir los intervalos de clases*/
                renderer_counties.addBreak({

                    minvalue: 0,
                    maxvalue: 7.6,
                    symbol: symDefault,
                    label: "Densidad baja"

                });
                renderer_counties.addBreak({

                    minvalue: 7.64,
                    maxvalue: 15.26,
                    symbol: new SimpleFillSymbol().setColor(new Color([255, 255, 0])),
                    label: "Densidad media"

                });
                renderer_counties.addBreak({

                    minvalue: 15.27,
                    maxvalue: 22.9,
                    symbol: new SimpleFillSymbol().setColor(new Color([255, 0, 10])),
                    label: "Densidad alta"

                })
                /*
                 * Step: Apply the renderer to the Counties layer
                 */

                
                var capas_usa = [];
                var capa_condado = new LayerDrawingOptions();
                capa_condado.renderer = renderer_counties;
                capas_usa[3]= capa_condado;               
                capa_dinamica.setLayerDrawingOptions(capas_usa);

                /*var arrayLayerDrawingOptionsUSA = [];
                var layerDrawingOptionsCounties = new LayerDrawingOptions();
                layerDrawingOptionsCounties.renderer = cbrCountyPopDensity;
                arrayLayerDrawingOptionsUSA[3] = layerDrawingOptionsCounties;
                capa_dinamica.setLayerDrawingOptions(arrayLayerDrawingOptionsUSA);*/

                

                


            


        };
    });
})