import {CanvasLayer} from "./CanvasLayer.js"
import {FillLayer} from "./FillLayer.js"
import {IconLayer} from "./IconLayer.js"
import {PointLayer} from "./PointLayer.js"
import {LineLayer} from "./LineLayer.js"
import {TextLayer} from "./TextLayer.js"
import {StationLayer} from "./StationLayer.js"
import {RasterLayer} from "./RasterLayer.js"
import {UpperStationLayer} from "./UpperStationLayer.js"
import {HeatmapLayer} from "./HeatmapLayer.js"
import {WindMapLayer} from "./WindMap/WindMapLayer.js"
import {GridLatLonLayers} from "./GridLatLonLayers.js"
import {ModelLayer} from "./ModelLayer.js"
import {threeDTileLayer} from "./3DTileLayer.js"
import {IsoLineLayer} from "./IsoLineLayer.js"
import {TyphoonLayer} from "./TyphoonLayer.js"
import {FY4GridTileLayer} from "./FY4GridTileLayer.js"

var MetoStyle = {
    CanvasLayer:CanvasLayer,
    FillLayer:FillLayer,
    IconLayer:IconLayer,
    PointLayer:PointLayer,
    LineLayer:LineLayer,
    TextLayer:TextLayer,
    StationLayer:StationLayer,
    RasterLayer:RasterLayer,
    UpperStationLayer:UpperStationLayer,
    HeatmapLayer:HeatmapLayer,
    WindMapLayer:WindMapLayer,
    GridLatLonLayers:GridLatLonLayers,
    ModelLayer:ModelLayer,
    IsoLineLayer:IsoLineLayer,
    TyphoonLayer:TyphoonLayer,
    FY4GridTileLayer:FY4GridTileLayer,
    threeDTileLayer:threeDTileLayer,
};
export {MetoStyle}