const express = require("express");
const fs = require('fs');
const app = express();
const router = express.Router();
const port = 9091;
const context = '/api';

const dashboardData = require('./payloads/dashboardStats.json')
const extendedReviewResponse = require('./payloads/extendedReviewResponse.json')
const authResponse = require('./payloads/auth.json')
const dtopSearchData = require('./payloads/dtopSearch.json')
const caseByIdData = require('./payloads/mdlCaseById.json')
const demographicData = require('./payloads/demographicData.json')
const caseSubmitData = require('./payloads/caseSubmit.json')
const historyData = require('./payloads/history.json')
const reasonsData = require('./payloads/refuseReasons.json')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    console.log(`method request ${req.url}`);
    next();
});

app.get("/", (req, res) => res.send('Up and running'))

router.get('/dashboard/stats', (req, res) => {
    console.log("Endpoint '/dashboard/stats' triggered.")

    res.json(dashboardData);
});

router.get('/auth', (req, res) => {

    console.log("Endpoint '/auth' triggered.")

    res.json(authResponse);
});

router.post('/auth', (req, res) => {

    console.log("Endpoint '/auth' triggered.")

    res.json(authResponse);
});


router.get('/document/actual/:documentId/additional/info', (req, res) => {
    const { documentId } = req.params;

    const documentInfo = {
        imageDate: "2024-02-06",
        similarityPercent: null,
        compareWarning: [],
        comparisonFound: false
    };

    console.log("Endpoint '/document/actual/:documentId/additional/info' triggered.")

    res.json(documentInfo);
});

router.get('/document/steps/EXTENDED_REVIEW', (req, res) => {

    console.log("Endpoint '/document/steps/EXTENDED_REVIEW' triggered.")

    res.json(extendedReviewResponse);
});

// Listado de la busqueda /mdl/search table
router.post('/dtop/search', (req, res) => {

    console.log("Endpoint '/dtop/search' triggered.");

    res.json(dtopSearchData);
});

// mdl case by id -> /mdl/case/:id
router.get('/mdl/case/:id', (req, res) => {

    console.log("Endpoint '/mdl/case/:id' triggered.")

    res.status(200).json(caseByIdData);
});

// Acciones: pause, reanudar, remove action
// PAUSE, RESUME, REMOVE
router.post('/mdl/case/:id/action/:action', (req, res) => {
    const { id, action } = req.params;

    if (!['PAUSE', 'RESUME', 'REMOVE'].includes(action.toUpperCase())) {
        return res.status(400).json({ message: `Invalid action type. Must be one of PAUSE, RESUME, or REMOVE.` });
    }

    console.log(`Case with ID ${id} has been marked as ${action}`);
    res.status(200).json({ message: `Case with ID ${id} has been successfully ${action}.` });
});

// Opt out action
router.post('/mdl/case/:id/opt-out', (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Bad request, missing case ID." });
    }

    console.log(`Case with ID ${id} has been marked as opted out`);
    res.status(200).json({ message: `Case with ID ${id} has been successfully opted out.` });
});

// Numero de licencia validation / 4 digits validation
// Numero de control / 7 digits validation
// CONTROL_NUMBER / SECURITY_CODE
router.post('/license/:validationType/validate', (req, res) => {

    console.log("Endpoint '/license/:validation-type/validate' triggered.", req.body)

    const { validationNumber } = req.body;
    const { validationType } = req.params;

    if (!validationNumber || !validationType) {
        return res.status(400).json({ message: "Bad request, missing validation number or validation type." });
    }

    if (!/^1+$/.test(validationNumber)) {
        return res.status(404).json({ message: "Invalid number" });
    }

    return res.sendStatus(200);
});

// datos demograficos / tabla validacion
router.get('/mdl/demographics/:id/compare', (req, res) => {

    console.log("Endpoint '/mdl/demographics/:id/compare' triggered.")

    res.json(demographicData);
});

// submit mdl case
// use current submit as example
// re-verify with backend if use existing submit endpoint
router.post('/mdl/case/submit', (req, res) => {

    console.log("Endpoint '/mdl/case/submit' triggered.", req.body)

    res.status(200).json(caseSubmitData);
});

// Comparación con imágenes de la solicitud de mDL, endpoint should return images
// /mdl/:front-license/image
router.get('/mdl/:imageType/image', (req, res) => {
    const { imageType } = req.params;

    const imageData = [
        {
            url: `https://picsum.photos/200`
        },
        {
            url: `https://picsum.photos/200`
        }
    ];

    console.log(`Endpoint '/mdl/${imageType}/image' triggered.`)

    res.json(imageData);
});

router.get('/case/history/:id', (req, res) => {

    res.json(historyData);
});

router.get('/document/reasons', (req, res) => {

    res.json(reasonsData);
});

// TODO
// mdl case history?
// mdl case step image?
// mock history endpoint

app.use(context, router);
app.listen(port, () => console.log(`Mock-server listening on port ${port}!`));

module.exports = app;
