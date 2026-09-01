/* =========================================================
   CONFIGURATION
   ========================================================= */


/*
 * LIEN WEB DE TON FORMULAIRE KOBO
 *
 * ⚠️ REMPLACE CETTE URL
 */

const KOBO_FORM_URL =
    "https://ee.kobotoolbox.org/single/BYiyz0ZJ";


/*
 * CHAMP QR DANS KOBO
 */

const QR_FIELD =
    "membres_group/qr_code_raw";


/*
 * MOT DE PASSE
 *
 * ⚠️ CHANGE LE MOT DE PASSE
 */

const PASSWORD =
    "RSU_pass_1234";


/*
 * NOM DE LA SESSION
 */

const AUTH_KEY =
    "scannerAuthenticated";


/* =========================================================
   VARIABLES
   ========================================================= */

let scanner = null;

let scannedCode = null;

let scanning = false;


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log("Application chargée");


        /*
         * Récupérer les éléments HTML
         */

        const loginButton =
            document.getElementById(
                "loginButton"
            );

        const passwordInput =
            document.getElementById(
                "passwordInput"
            );

        const continueButton =
            document.getElementById(
                "continueButton"
            );

        const rescanButton =
            document.getElementById(
                "rescanButton"
            );

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        /*
         * Vérifier les éléments
         */

        if (!loginButton) {

            console.error(
                "ERREUR : loginButton introuvable"
            );

            return;
        }


        /*
         * Bouton connexion
         */

        loginButton.addEventListener(
            "click",
            login
        );


        /*
         * Touche Entrée
         */

        passwordInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    login();

                }

            }
        );


        /*
         * Bouton Enregistrer
         */

        continueButton.addEventListener(
            "click",
            openKoboForm
        );


        /*
         * Scanner à nouveau
         */

        rescanButton.addEventListener(
            "click",
            restartScanner
        );


        /*
         * Verrouiller
         */

        logoutButton.addEventListener(
            "click",
            logout
        );


        /*
         * Vérifier si déjà connecté
         */

        if (
            sessionStorage.getItem(
                AUTH_KEY
            ) === "true"
        ) {

            showScanner();

        } else {

            showLogin();

        }

    }
);


/* =========================================================
   CONNEXION
   ========================================================= */

function login() {

    console.log(
        "Tentative de connexion"
    );


    const passwordInput =
        document.getElementById(
            "passwordInput"
        );

    const loginError =
        document.getElementById(
            "loginError"
        );


    const enteredPassword =
        passwordInput.value;


    /*
     * Vérification
     */

    if (
        enteredPassword === PASSWORD
    ) {

        console.log(
            "Mot de passe correct"
        );


        /*
         * Mémoriser la connexion
         * pendant la session Safari.
         */

        sessionStorage.setItem(
            AUTH_KEY,
            "true"
        );


        /*
         * Nettoyer
         */

        passwordInput.value = "";

        loginError.textContent = "";


        /*
         * Afficher scanner
         */

        showScanner();

    } else {

        console.log(
            "Mot de passe incorrect"
        );


        loginError.textContent =
            "❌ Mot de passe incorrect.";

        passwordInput.value = "";

        passwordInput.focus();

    }
}


/* =========================================================
   AFFICHER LOGIN
   ========================================================= */

function showLogin() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const scannerScreen =
        document.getElementById(
            "scannerScreen"
        );


    loginScreen.style.display =
        "flex";

    scannerScreen.style.display =
        "none";

}


/* =========================================================
   AFFICHER SCANNER
   ========================================================= */

function showScanner() {

    const loginScreen =
        document.getElementById(
            "loginScreen"
        );

    const scannerScreen =
        document.getElementById(
            "scannerScreen"
        );


    loginScreen.style.display =
        "none";

    scannerScreen.style.display =
        "block";


    /*
     * Démarrer la caméra
     */

    startScanner();

}


/* =========================================================
   DÉMARRER LE SCANNER
   ========================================================= */

function startScanner() {

    console.log(
        "Démarrage caméra"
    );


    const reader =
        document.getElementById(
            "reader"
        );


    const status =
        document.getElementById(
            "status"
        );


    const result =
        document.getElementById(
            "result"
        );


    /*
     * Nettoyer
     */

    reader.innerHTML = "";

    result.classList.add(
        "hidden"
    );


    scannedCode = null;


    status.textContent =
        "Demande d'accès à la caméra...";


    /*
     * Vérifier HTTPS
     */

    if (
        !window.isSecureContext
    ) {

        status.textContent =
            "🔒 Cette page doit être ouverte en HTTPS.";

        return;
    }


    /*
     * Vérifier la bibliothèque
     */

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        status.textContent =
            "❌ Le scanner QR n'a pas pu être chargé.";

        console.error(
            "Html5Qrcode n'est pas disponible"
        );

        return;
    }


    /*
     * Créer scanner
     */

    scanner =
        new Html5Qrcode(
            "reader"
        );


    /*
     * Configuration
     */

    const config = {

        fps: 10,

        qrbox: {
            width: 250,
            height: 250
        },

        aspectRatio: 1.0

    };


    /*
     * Démarrer caméra arrière.
     *
     * On utilise "environment"
     * sans "exact", car Safari peut
     * refuser exact:environment.
     */

    scanner.start(

        {
            facingMode: "environment"
        },

        config,

        onScanSuccess,

        onScanFailure

    )
    .then(
        function () {

            scanning = true;

            status.textContent =
                "📷 Placez le QR code devant la caméra.";

            console.log(
                "Caméra démarrée"
            );

        }
    )
    .catch(
        function (error) {

            scanning = false;

            handleCameraError(
                error
            );

        }
    );

}


/* =========================================================
   QR DÉTECTÉ
   ========================================================= */

function onScanSuccess(
    decodedText
) {

    if (
        !decodedText ||
        scannedCode !== null
    ) {

        return;
    }


    console.log(
        "QR détecté :",
        decodedText
    );


    scannedCode =
        decodedText;


    /*
     * Arrêter caméra
     */

    stopScanner();


    /*
     * Afficher résultat
     */

    const code =
        document.getElementById(
            "code"
        );

    const status =
        document.getElementById(
            "status"
        );

    const result =
        document.getElementById(
            "result"
        );


    code.textContent =
        decodedText;


    status.textContent =
        "✅ QR code détecté.";


    result.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ERREUR DE LECTURE QR
   ========================================================= */

function onScanFailure(error) {

    /*
     * Ne rien afficher.
     *
     * Cette fonction est appelée
     * en permanence pendant le scan.
     */

}


/* =========================================================
   ERREUR CAMÉRA
   ========================================================= */

function handleCameraError(
    error
) {

    console.error(
        "Erreur caméra :",
        error
    );


    const status =
        document.getElementById(
            "status"
        );


    let message =
        "❌ Impossible d'accéder à la caméra.";


    if (
        error &&
        (
            error.name ===
            "NotAllowedError"
            ||
            String(error).includes(
                "NotAllowedError"
            )
        )
    ) {

        message =
            "📷 Accès à la caméra refusé. " +
            "Autorisez la caméra pour ce site " +
            "dans les réglages de Safari, " +
            "puis rechargez la page.";

    }

    else if (
        !window.isSecureContext
    ) {

        message =
            "🔒 La caméra nécessite HTTPS.";

    }

    else if (
        error &&
        (
            error.name ===
            "NotReadableError"
            ||
            String(error).includes(
                "NotReadableError"
            )
        )
    ) {

        message =
            "📷 La caméra est déjà utilisée " +
            "par une autre application.";

    }


    status.textContent =
        message;

}


/* =========================================================
   ARRÊTER CAMÉRA
   ========================================================= */

function stopScanner() {

    if (
        scanner &&
        scanning
    ) {

        scanner
            .stop()
            .then(
                function () {

                    scanning = false;

                }
            )
            .catch(
                function (error) {

                    console.error(
                        "Erreur arrêt scanner :",
                        error
                    );

                    scanning = false;

                }
            );

    }

}


/* =========================================================
   OUVRIR KOBO
   ========================================================= */

function openKoboForm() {

    if (!scannedCode) {

        alert(
            "Aucun QR code n'a été détecté."
        );

        return;
    }


    /*
     * Vérifier configuration Kobo
     */

    if (
        KOBO_FORM_URL.includes(
            "TON_FORM_ID"
        )
    ) {

        alert(
            "⚠️ Configurez KOBO_FORM_URL " +
            "dans app.js."
        );

        return;
    }


    /*
     * Paramètres URL
     */

    const params =
        new URLSearchParams();


    /*
     * Préremplir le QR
     */

    params.append(
        "d[" + QR_FIELD + "]",
        scannedCode
    );


    /*
     * Adresse de retour
     */

    const returnUrl =
        window.location.origin +
        window.location.pathname;


    params.append(
        "return_url",
        returnUrl
    );


    /*
     * Construire URL Kobo
     */

    const koboUrl =
        KOBO_FORM_URL +
        "?" +
        params.toString();


    console.log(
        "URL Kobo :",
        koboUrl
    );


    /*
     * Aller vers Kobo
     */

    window.location.href =
        koboUrl;

}


/* =========================================================
   SCANNER À NOUVEAU
   ========================================================= */

function restartScanner() {

    stopScanner();


    scannedCode = null;


    const code =
        document.getElementById(
            "code"
        );

    const result =
        document.getElementById(
            "result"
        );

    const reader =
        document.getElementById(
            "reader"
        );


    code.textContent = "";

    result.classList.add(
        "hidden"
    );

    reader.innerHTML = "";


    setTimeout(
        function () {

            startScanner();

        },
        300
    );

}


/* =========================================================
   VERROUILLER
   ========================================================= */

function logout() {

    console.log(
        "Verrouillage"
    );


    /*
     * Supprimer la session
     */

    sessionStorage.removeItem(
        AUTH_KEY
    );


    /*
     * Arrêter caméra
     */

    stopScanner();


    /*
     * Afficher login
     */

    showLogin();


    /*
     * Donner le focus
     */

    document
        .getElementById(
            "passwordInput"
        )
        .focus();

}
