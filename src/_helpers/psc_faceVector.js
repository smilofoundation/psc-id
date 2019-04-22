import * as faceapi from 'face-api.js';
var canvas = require('canvas');

export class FaceVector {

    constructor() {
        this.faceapi = faceapi;
        this.faceapi.nets.ssdMobilenetv1.loadFromUri('./assets/models');
        this.faceapi.nets.faceLandmark68Net.loadFromUri('./assets/models');
        this.faceapi.nets.faceRecognitionNet.loadFromUri('./assets/models');
    }

    /**
     * Performs a face analyses on the given input.
     * @param input
     */
    async detectSingleFace(input) {

        const man0 = await canvas.loadImage(input);
        const options = new this.faceapi.SsdMobilenetv1Options();

        const faceScan = await this.faceapi.detectSingleFace(man0, options).withFaceLandmarks().withFaceDescriptor();
        if (!faceScan || !faceScan.detection)
            return null;

        const result = {
            confidence: faceScan.detection.score,
            vectors: faceScan.descriptor
        };

        return result;
    }
}