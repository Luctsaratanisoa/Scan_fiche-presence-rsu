/*
 * ==========================================
 * CONFIGURATION
 * ==========================================
 */

// IMPORTANT : remplace cette URL par le lien Web
// de ton formulaire KoboToolbox.

const KOBO_FORM_URL =
    "https://ee.kobotoolbox.org/single/BYiyz0ZJ";

// URL de cette page GitHub.
// Exemple :
// https://moncompte.github.io/qr-scanner/

const RETURN_URL =
    window.location.origin + window.location.pathname;


// Nom du champ QR dans ton XLSForm.
//
// Comme qr_code_raw se trouve dans le repeat
// membres_group, on utilise le chemin complet.

const QR_FIELD =
    "membres_group/qr_code_raw";


/*
 * ==========================================
 * VARIABLES
 * ==========================================
 */

let scanner = null;
let scannedCode = null;
let scanning = false;


/*
 * ==========================================
 * INITIALISATION
 * ==========================================
 */

document.addEventListener("DOMContentLoaded", function () {

    startScanner();

    document
        .getElementById("continueButton")
        .addEventListener("click", openKoboForm);

    document
        .getElementById("rescanButton")
        .addEventListener("click", restartScanner);

});


/*
 * ==========================================
 * DÉMARRER LE SCANNER
 * ==========================================
 */

function startScanner() {

    document
        .getElementById("result")
        .classList.add("hidden");

    document
        .getElementById("status")
        .textContent =
        "Placez le QR code devant la caméra.";

    scanner = new Html5Qrcode("reader");

    scanner.start(
        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: {
                width: 250,
                height: 250
            }
        },

        onScanSuccess,

        onScanFailure

    ).then(function () {

        scanning = true;

    }).catch(function (error) {

        document
            .getElementById("status")
            .textContent =
            "Impossible d'accéder à la caméra : " + error;

    });
}


/*
 * ==========================================
 * QR DÉTECTÉ
 * ==========================================
 */

function onScanSuccess(decodedText) {

    if (!decodedText || scannedCode !== null) {
        return;
    }

    scannedCode = decodedText;

    stopScanner();

    document
        .getElementById("code")
        .textContent = decodedText;

    document
        .getElementById("status")
        .textContent =
        "QR code détecté.";

    document
        .getElementById("result")
        .classList.remove("hidden");
}


/*
 * ==========================================
 * ERREURS DE LECTURE
 * ==========================================
 */

function onScanFailure(error) {
    // Ne rien afficher.
    // Cette fonction est appelée très souvent
    // pendant la recherche du QR code.
}


/*
 * ==========================================
 * ARRÊTER LA CAMÉRA
 * ==========================================
 */

function stopScanner() {

    if (scanner && scanning) {

        scanner.stop()
            .then(function () {

                scanning = false;

            })
            .catch(function () {

                scanning = false;

            });
    }
}


/*
 * ==========================================
 * OUVRIR KOBO
 * ==========================================
 */

function openKoboForm() {

    if (!scannedCode) {
        return;
    }

    const params = new URLSearchParams();

    /*
     * Préremplissage du champ QR.
     *
     * Kobo attend :
     *
     * d[membres_group/qr_code_raw]=VALEUR
     */

    params.append(
        "d[" + QR_FIELD + "]",
        scannedCode
    );


    /*
     * Après la soumission du formulaire,
     * Kobo revient sur notre scanner.
     */

    params.append(
        "return_url",
        RETURN_URL
    );


    const url =
        KOBO_FORM_URL +
        "?" +
        params.toString();


    window.location.href = url;
}


/*
 * ==========================================
 * NOUVEAU SCAN
 * ==========================================
 */

function restartScanner() {

    scannedCode = null;

    document
        .getElementById("result")
        .classList.add("hidden");

    document
        .getElementById("reader")
        .innerHTML = "";

    startScanner();
}
