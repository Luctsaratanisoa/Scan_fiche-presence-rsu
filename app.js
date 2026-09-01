/* =========================================================
   CONFIGURATION
   ========================================================= */


/*
 * =========================================================
 * 1. LIEN DE TON FORMULAIRE KOBO
 * =========================================================
 *
 * REMPLACE cette adresse par le vrai lien Web de ton
 * formulaire KoboToolbox.
 *
 * Exemple :
 *
 * https://ee.kobotoolbox.org/x/AbCdEf123
 *
 */

const KOBO_FORM_URL =
    "https://ee.kobotoolbox.org/single/BYiyz0ZJ";


/*
 * =========================================================
 * 2. CHAMP QR DANS KOBO
 * =========================================================
 *
 * Dans ton formulaire, qr_code_raw se trouve dans :
 *
 * membres_group
 *
 * Donc nous utilisons :
 *
 * membres_group/qr_code_raw
 *
 */

const QR_FIELD =
    "membres_group/qr_code_raw";


/*
 * =========================================================
 * 3. MOT DE PASSE
 * =========================================================
 *
 * CHANGE cette valeur.
 *
 * Exemple :
 *
 * const PASSWORD = "MonMotDePasse2026";
 *
 */

const PASSWORD =
    "RSU_pass_1234";


/*
 * =========================================================
 * 4. NOM DE LA SESSION
 * =========================================================
 */

const AUTH_KEY =
    "scannerAuthenticated";


/*
 * =========================================================
 * VARIABLES
 * =========================================================
 */

let scanner = null;

let scannedCode = null;

let scanning = false;


/*
 * =========================================================
 * ÉLÉMENTS HTML
 * =========================================================
 */

const loginScreen =
    document.getElementById("loginScreen");

const scannerScreen =
    document.getElementById("scannerScreen");

const passwordInput =
    document.getElementById("passwordInput");

const loginButton =
    document.getElementById("loginButton");

const loginError =
    document.getElementById("loginError");

const logoutButton =
    document.getElementById("logoutButton");

const continueButton =
    document.getElementById("continueButton");

const rescanButton =
    document.getElementById("rescanButton");

const result =
    document.getElementById("result");

const code =
    document.getElementById("code");

const status =
    document.getElementById("status");


/*
 * =========================================================
 * DÉMARRAGE DE L'APPLICATION
 * =========================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /*
         * Vérifier si l'utilisateur est déjà
         * authentifié.
         */

        if (
            sessionStorage.getItem(AUTH_KEY)
            === "true"
        ) {

            showScanner();

        } else {

            showLogin();

        }


        /*
         * Bouton connexion
         */

        loginButton.addEventListener(
            "click",
            login
        );


        /*
         * Touche Entrée dans le mot de passe
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
         * Enregistrer
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

    }
);


/*
 * =========================================================
 * CONNEXION
 * =========================================================
 */

function login() {

    const enteredPassword =
        passwordInput.value;


    /*
     * Vérification du mot de passe
     */

    if (
        enteredPassword === PASSWORD
    ) {

        /*
         * Mémoriser l'authentification
         * uniquement pendant la session.
         */

        sessionStorage.setItem(
            AUTH_KEY,
            "true"
        );


        /*
         * Effacer le mot de passe
         */

        passwordInput.value = "";

        loginError.textContent = "";


        /*
         * Afficher le scanner
         */

        showScanner();

    } else {

        /*
         * Mauvais mot de passe
         */

        loginError.textContent =
            "❌ Mot de passe incorrect.";

        passwordInput.value = "";

        passwordInput.focus();

    }
}


/*
 * =========================================================
 * AFFICHER L'ÉCRAN DE CONNEXION
 * =========================================================
 */

function showLogin() {

    loginScreen.style.display =
        "flex";

    scannerScreen.style.display =
        "none";

}


/*
 * =========================================================
 * AFFICHER LE SCANNER
 * =========================================================
 */

function showScanner() {

    loginScreen.style.display =
        "none";

    scannerScreen.style.display =
        "block";


    /*
     * Démarrer la caméra.
     */

    startScanner();

}


/*
 * =========================================================
 * DÉMARRER LE SCANNER
 * =========================================================
 */

function startScanner() {

    /*
     * Nettoyer l'ancien scanner.
     */

    document
        .getElementById("reader")
        .innerHTML = "";


    result.classList.add("hidden");


    status.textContent =
        "Autorisez l'accès à la caméra.";


    scannedCode = null;


    /*
     * Créer le scanner.
     */

    scanner =
        new Html5Qrcode("reader");


    /*
     * Configuration caméra.
     */

    scanner.start(

        {
            facingMode: {
                exact: "environment"
            }
        },

        {
            fps: 10,

            qrbox: {
                width: 250,
                height: 250
            },

            aspectRatio: 1.0
        },

        onScanSuccess,

        onScanFailure

    )
    .then(
        function () {

            scanning = true;

            status.textContent =
                "Placez le QR code devant la caméra.";

        }
    )
    .catch(
        function (error) {

            scanning = false;

            handleCameraError(error);

        }
    );
}


/*
 * =========================================================
 * QR CODE DÉTECTÉ
 * =========================================================
 */

function onScanSuccess(decodedText) {

    /*
     * Éviter plusieurs détections.
     */

    if (
        !decodedText ||
        scannedCode !== null
    ) {

        return;

    }


    /*
     * Mémoriser le code.
     */

    scannedCode =
        decodedText;


    /*
     * Arrêter la caméra.
     */

    stopScanner();


    /*
     * Afficher le code.
     */

    code.textContent =
        decodedText;


    status.textContent =
        "QR code détecté.";


    /*
     * Afficher le résultat.
     */

    result.classList.remove(
        "hidden"
    );
}


/*
 * =========================================================
 * ERREUR DE SCAN
 * =========================================================
 */

function onScanFailure(error) {

    /*
     * Ne rien afficher ici.
     *
     * Cette fonction est appelée très souvent
     * pendant que le scanner cherche un QR code.
     */

}


/*
 * =========================================================
 * ERREUR CAMÉRA
 * =========================================================
 */

function handleCameraError(error) {

    console.error(
        "Erreur caméra :",
        error
    );


    let message =
        "Impossible d'accéder à la caméra.";


    /*
     * Permission refusée.
     */

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
            "dans les réglages de Safari.";

    }


    /*
     * Page non sécurisée.
     */

    else if (
        !window.isSecureContext
    ) {

        message =
            "🔒 La caméra nécessite une connexion HTTPS. " +
            "Vérifiez que votre page GitHub utilise https://.";

    }


    /*
     * Caméra déjà utilisée.
     */

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


/*
 * =========================================================
 * ARRÊTER LE SCANNER
 * =========================================================
 */

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
                        "Erreur arrêt caméra :",
                        error
                    );

                    scanning = false;

                }
            );

    }
}


/*
 * =========================================================
 * OUVRIR LE FORMULAIRE KOBO
 * =========================================================
 */

function openKoboForm() {

    /*
     * Vérifier qu'un QR a été scanné.
     */

    if (!scannedCode) {

        alert(
            "Aucun QR code n'a été détecté."
        );

        return;
    }


    /*
     * Vérifier que l'URL Kobo est configurée.
     */

    if (
        KOBO_FORM_URL.includes(
            "TON_FORM_ID"
        )
    ) {

        alert(
            "Vous devez d'abord configurer " +
            "KOBO_FORM_URL dans app.js."
        );

        return;
    }


    /*
     * Créer les paramètres URL.
     */

    const params =
        new URLSearchParams();


    /*
     * Préremplir le champ QR.
     *
     * Kobo :
     *
     * d[membres_group/qr_code_raw]
     */

    params.append(
        "d[" + QR_FIELD + "]",
        scannedCode
    );


    /*
     * =====================================================
     * LIEN DE RETOUR
     * =====================================================
     *
     * On récupère automatiquement l'adresse
     * de la page GitHub actuelle.
     *
     */

    const returnUrl =
        window.location.origin +
        window.location.pathname;


    params.append(
        "return_url",
        returnUrl
    );


    /*
     * Construire l'URL finale.
     */

    const koboUrl =
        KOBO_FORM_URL +
        "?" +
        params.toString();


    console.log(
        "Ouverture Kobo :",
        koboUrl
    );


    /*
     * Ouvrir Kobo.
     */

    window.location.href =
        koboUrl;
}


/*
 * =========================================================
 * NOUVEAU SCAN
 * =========================================================
 */

function restartScanner() {

    /*
     * Arrêter l'ancien scanner.
     */

    stopScanner();


    /*
     * Effacer le code précédent.
     */

    scannedCode = null;

    code.textContent = "";


    /*
     * Cacher le résultat.
     */

    result.classList.add(
        "hidden"
    );


    /*
     * Vider le lecteur.
     */

    document
        .getElementById("reader")
        .innerHTML = "";


    /*
     * Redémarrer.
     */

    setTimeout(
        function () {

            startScanner();

        },
        300
    );
}


/*
 * =========================================================
 * VERROUILLER
 * =========================================================
 */

function logout() {

    /*
     * Supprimer l'authentification.
     */

    sessionStorage.removeItem(
        AUTH_KEY
    );


    /*
     * Arrêter la caméra.
     */

    stopScanner();


    /*
     * Retour à l'écran de connexion.
     */

    showLogin();


    /*
     * Mettre le curseur dans le champ.
     */

    passwordInput.focus();

}
