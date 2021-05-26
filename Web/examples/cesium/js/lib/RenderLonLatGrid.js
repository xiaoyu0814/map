/**
 * Created by chengdz on 2017/3/14.
 */

define([
    '../../Core/BoundingSphere',
    '../../Core/BoxGeometry',
    '../../Core/Cartesian2',
    '../../Core/Cartesian3',
    '../../Core/Cartesian4',
    '../../Core/ComponentDatatype',
    '../../Core/combine',
    '../../Core/defaultValue',
    '../../Core/defined',
    '../../Core/destroyObject',
    '../../Core/DeveloperError',
    '../../Core/EllipsoidGeodesic',
    '../../Core/Matrix4',
    '../../Core/VertexFormat',
    '../../Core/PrimitiveType',
    '../../Core/IndexDatatype',
    '../../Core/Ellipsoid',
    '../../Core/Cartographic',
    '../../Core/Color',
    '../../Core/Math',
    '../../Renderer/Buffer',
    '../../Renderer/BufferUsage',
    '../../Renderer/DrawCommand',
    '../../Renderer/RenderState',
    '../../Renderer/ShaderProgram',
    '../../Renderer/ShaderSource',
    '../../Renderer/VertexArray',
    '../../Renderer/Pass',
    '../../Scene/Label',
    '../../Scene/LabelCollection',
    '../../Scene/BlendingState',
    '../../Scene/CullFace',
    '../../Scene/Material',
    '../../Scene/Scene',
    '../../Scene/Globe',
    '../../Scene/SceneMode',
    '../../Weather/RenderData/Base/Mesh',
    '../../Weather/VertexType/ColorVertex3r',
    '../../Weather/Render/RenderVectorObject',
    '../../Weather/Shaders/LonLatGridLineVS',
    '../../Weather/Shaders/LonLatGridLineFS'
], function (BoundingSphere,
             BoxGeometry,
             Cartesian2,
             Cartesian3,
             Cartesian4,
             ComponentDatatype,
             combine,
             defaultValue,
             defined,
             destroyObject,
             DeveloperError,
             EllipsoidGeodesic,
             Matrix4,
             VertexFormat,
             PrimitiveType,
             IndexDatatype,
             Ellipsoid,
             Cartographic,
             Color,
             Math,
             Buffer,
             BufferUsage,
             DrawCommand,
             RenderState,
             ShaderProgram,
             ShaderSource,
             VertexArray,
             Pass,
             Label,
             LabelCollection,
             BlendingState,
             CullFace,
             Material,
             Scene,
             Globe,
             SceneMode,
             Mesh,
             ColorVertex3r,
             RenderVectorObject,
             LonLatGridLineVS,
             LonLatGridLineFS) {
    'use strict';

    function RenderLonLatGrid(options) {
        RenderVectorObject.call(this, options);
        //线宽
        this.m_fLineWidth = 1.0;

        //顶点shader
        this._vertexShaderSource = LonLatGridLineVS;
        //片元shader
        this._fragmentShaderSource = LonLatGridLineFS;
        //合并顶点Shader
        this.CombineShader();
        //图元类型
        this._PrimitiveType = PrimitiveType.LINES;
        var that = this;
        var childUniforms = {
            u_LineColor: function () {
                return that.m_Color;
            }
        };
        this._uniforms = combine(this._uniforms, childUniforms);

        this.m_LonLabels = new Map();
        this.m_LatLabels = new Map();
        this.m_labelCollection = undefined;

        this.m_scene = undefined;
        this.m_LabelColor = new Color(255, 0, 0, 255);
        this.m_LabelSize = 20;
    }

    RenderLonLatGrid.prototype = new RenderVectorObject;

    //virtual
    RenderLonLatGrid.prototype.CreateMesh = function (context, mesh) {
        var attributeLocations = {
            Position: 0,
            HLevel: 1
        };
        //创建mesh
        var buffer1 = Buffer.createVertexBuffer({
            context: context,
            typedArray: mesh.m_vertexs,
            usage: BufferUsage.STATIC_DRAW
        });

        var indexBuffer = Buffer.createIndexBuffer({
            context: context,
            typedArray: mesh.m_indices,
            usage: BufferUsage.STATIC_DRAW,
            indexDatatype: IndexDatatype.UNSIGNED_SHORT
        });

        var iSizeInBytes1 = Float32Array.BYTES_PER_ELEMENT;
        var iStride1 = 3 * iSizeInBytes1;

        var attributes = [
            {
                index: attributeLocations.Position,
                vertexBuffer: buffer1,
                componentsPerAttribute: 2,
                componentDatatype: ComponentDatatype.FLOAT,
                offsetInBytes: 0,
                strideInBytes: iStride1
            },
            {
                index: attributeLocations.HLevel,
                vertexBuffer: buffer1,
                componentsPerAttribute: 1,//tag此值和shader里的属性数据类型相关
                componentDatatype: ComponentDatatype.FLOAT,//tag此值和shader里的属性数据类型相关
                normalize: false,
                offsetInBytes: 2 * iSizeInBytes1,
                strideInBytes: iStride1
            }
        ];
        var vertexArray = new VertexArray({
            context: context,
            attributes: attributes,
            indexBuffer: indexBuffer
        });
        return vertexArray;
    }

    //virtual
    RenderLonLatGrid.prototype.Initialize = function (context) {
        this.CreateGirdLines();
        return RenderVectorObject.prototype.Initialize.call(this, context);
    }

    var labelGeoPos = new Cartographic();

    RenderLonLatGrid.prototype.StartRender = function (frameState) {
        var bResult = RenderVectorObject.prototype.StartRender.call(this, frameState);
        if (bResult === false) {
            return false;
        }
        var centerLonLat = frameState.camera.positionCartographic;
        var ellipsoid = frameState.camera._scene.globe.ellipsoid;

        this.m_dCameraDistance = frameState.camera._measuringScale * 500;
        for (var itr1 in this.m_LonLabels) {
            var lon = parseFloat(itr1);
            if (this.m_dCameraDistance > 20000000.0 && (Math.mod(lon, 32.0) > 0.0)) {
                this.m_LonLabels[itr1].show = false;
            }
            else if (this.m_dCameraDistance > 3200000.0 && (Math.mod(lon, 16.0) > 0.0)) {
                this.m_LonLabels[itr1].show = false;
            }
            else if (this.m_dCameraDistance > 2000000.0 && (Math.mod(lon, 4.0) > 0.0)) {
                this.m_LonLabels[itr1].show = false;
            }
            else if (this.m_dCameraDistance > 1000000.0 && (Math.mod(lon, 2.0) > 0.0)) {
                this.m_LonLabels[itr1].show = false;
            }
            else {
                labelGeoPos = Cartographic.fromDegrees(lon, 0, 10);
                labelGeoPos.latitude = centerLonLat.latitude;
                this.m_LonLabels[itr1].show = true;
                this.m_LonLabels[itr1].position = ellipsoid.cartographicToCartesian(labelGeoPos);
            }
        }
        for (var itr2 in this.m_LatLabels) {
            var lat = parseFloat(itr2);
            if (this.m_dCameraDistance > 3200000.0 && (Math.mod(lat, 16.0) > 0.0)) {
                this.m_LatLabels[itr2].show = false;
            }
            else if (this.m_dCameraDistance > 2000000.0 && (Math.mod(lat, 4.0) > 0.0)) {
                this.m_LatLabels[itr2].show = false;
            }
            else if (this.m_dCameraDistance > 1000000.0 && (Math.mod(lat, 2.0) > 0.0)) {
                this.m_LatLabels[itr2].show = false;
            }
            else {
                labelGeoPos = Cartographic.fromDegrees(0, lat, 10);
                labelGeoPos.longitude = centerLonLat.longitude;
                this.m_LatLabels[itr2].show = true;
                this.m_LatLabels[itr2].position = ellipsoid.cartographicToCartesian(labelGeoPos);
            }
        }
        return bResult;
    }

    var dStartLon = -180;
    var dStartLat = 90;
    var iSizeX = 181;
    var iSizeY = 91;
    var dIntervalX = 360 / (iSizeX - 1);
    var dIntervalY = -180 / (iSizeY - 1);

    var iVByteIndex = 0;
    var iIByteIndex = 0;
    var iCurVCount = 0;
    var geoPos = new Cartesian2();

    RenderLonLatGrid.prototype.CreateGirdLines = function () {
        iVByteIndex = 0;
        iIByteIndex = 0;
        iCurVCount = 0;
        //纬线
        var latMesh = new Mesh();
        latMesh.m_vertexs = new Float32Array(iSizeX * iSizeY * 3);
        latMesh.m_indices = new Uint16Array((iSizeX - 1) * 2 * iSizeY);
        for (var iy = 0; iy < iSizeY; ++iy) {
            geoPos.y = dStartLat + iy * dIntervalY;
            for (var ix = 0; ix < iSizeX; ++ix) {
                geoPos.x = dStartLon + ix * dIntervalX;
                latMesh.m_vertexs[iVByteIndex++] = geoPos.x;
                latMesh.m_vertexs[iVByteIndex++] = geoPos.y;
                latMesh.m_vertexs[iVByteIndex++] = geoPos.y;
                iCurVCount++;

                if (ix < iSizeX - 1) {
                    latMesh.m_indices[iIByteIndex++] = iCurVCount - 1;
                    latMesh.m_indices[iIByteIndex++] = iCurVCount;
                }
            }
        }
        this._meshs.push(latMesh);

        iVByteIndex = 0;
        iIByteIndex = 0;
        iCurVCount = 0;

        var iTempSizeX = iSizeX;
        //经线
        var lonMesh = new Mesh();
        lonMesh.m_vertexs = new Float32Array(iTempSizeX * iSizeY * 3);
        lonMesh.m_indices = new Uint16Array((iSizeY - 1) * 2 * iTempSizeX);
        for (ix = 0; ix < iTempSizeX; ++ix) {
            geoPos.x = dStartLon + ix * dIntervalX;
            for (iy = 0; iy < iSizeY; ++iy) {
                geoPos.y = dStartLat + iy * dIntervalY;
                lonMesh.m_vertexs[iVByteIndex++] = geoPos.x;
                lonMesh.m_vertexs[iVByteIndex++] = geoPos.y;
                lonMesh.m_vertexs[iVByteIndex++] = geoPos.x;
                iCurVCount++;

                if (iy < iSizeY - 1) {
                    lonMesh.m_indices[iIByteIndex++] = iCurVCount - 1;
                    lonMesh.m_indices[iIByteIndex++] = iCurVCount;
                }
            }
        }
        this._meshs.push(lonMesh);
    };

    RenderLonLatGrid.prototype.CreateLabels = function (scene) {
        this.m_labelCollection = scene.primitives.add(new LabelCollection());
        var ellipsoid = scene.globe.ellipsoid;
        var worldPos = ellipsoid.cartographicToCartesian(new Cartographic(0, 0, 0));

        var textArray = ["°N", "°S", "Equator", "Prime meridian", "°E", "°W"];

        //纬线标注
        var preText = undefined;
        for (var iy = 0; iy < iSizeY; ++iy) {
            var lat = dStartLat + iy * dIntervalY;
            if (lat > 0) {
                preText = lat.toString() + textArray[0].toString();
            }
            else if (lat < 0) {
                preText = lat.toString() + textArray[1].toString();
            }
            else {
                preText = textArray[2].toString();
            }
            var label1 = this.m_labelCollection.add({
                position: worldPos,
                text: preText,
                font: this.m_LabelSize.toString() + 'px sans-serif',
                fillColor: this.m_LabelColor
            });
            this.m_LatLabels[lat] = label1;
        }
        //经线标注
        for (var ix = 0; ix < iSizeX - 1; ++ix) {
            var lon = dStartLon + ix * dIntervalX;
            if (lon === 0) {
                preText = textArray[3].toString();
            }
            else if (lon > 0) {
                preText = lon.toString() + textArray[4].toString();
            }
            else if (lon < 0) {
                preText = lon.toString() + textArray[5].toString();
            }
            var label2 = this.m_labelCollection.add({
                position: worldPos,
                text: preText,
                font: this.m_LabelSize.toString() + 'px sans-serif',
                fillColor: this.m_LabelColor
            });
            this.m_LonLabels[lon] = label2;
        }
    }

    RenderLonLatGrid.prototype.SetLineWidth = function (fLineWidth) {
        this.m_fLineWidth = fLineWidth;
    }

    RenderLonLatGrid.prototype.SetLabelColor = function (cLabelColor) {
        this.m_LabelColor = cLabelColor;
    }

    RenderLonLatGrid.prototype.SetLabelSize = function (iLabelSize) {
        this.m_LabelSize = iLabelSize;
    }

    RenderLonLatGrid.prototype.SetVisible = function (bVisible) {
        this.show = bVisible;
        if (this.m_labelCollection !== undefined)
            this.m_labelCollection.show = bVisible;
        for (var itr1 in this.m_LonLabels) {
            this.m_LonLabels[itr1].show = bVisible;
        }
        for (var itr2 in this.m_LatLabels) {
            this.m_LatLabels[itr2].show = bVisible;
        }
    };

    RenderLonLatGrid.prototype.SetScene = function (scene) {
        this.m_Scene = scene;
    };

    RenderLonLatGrid.prototype.destroy = function () {
        if (this.m_Scene === undefined) {
            return;
        }
        this.m_Scene.primitives.remove(this.m_labelCollection);
        RenderVectorObject.prototype.destroy.call(this);
    };

    return RenderLonLatGrid;
});
