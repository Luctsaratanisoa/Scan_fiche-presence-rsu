/* =========================================================
   CONFIGURATION
   ========================================================= */


/*
 * ========================================================
 * LIEN WEB DU FORMULAIRE KOBO
 * ========================================================
 *
 * ⚠️ REMPLACER PAR LE VRAI LIEN DE TON FORMULAIRE
 */

const KOBO_FORM_URL =
    "https://ee.kobotoolbox.org/single/5wtbPWQd";


/*
 * ========================================================
 * MOT DE PASSE
 * ========================================================
 *
 * ⚠️ CHANGE CE MOT DE PASSE
 */

const PASSWORD =
    "Pass_RSU_2026";


/*
 * ========================================================
 * CLÉS DE SESSION
 * ========================================================
 */

const AUTH_KEY =
    "scannerAuthenticated";

const SETTINGS_KEY =
    "scannerSettings";


/*
 * ========================================================
 * VARIABLES DU SCANNER
 * ========================================================
 */

let scanner = null;

let scannedCode = null;

let scanning = false;


/*
 * ========================================================
 * LISTE DES COMMUNES
 * ========================================================
 *
 * Elle correspond à ton XLSForm.
 */

const communes = {

    ambohidratrimo: [

        {
            value: "ambohidratrimo_c",
            label: "Ambohidratrimo"
        },

        {
            value: "ambohimanjaka",
            label: "Ambohimanjaka"
        },

        {
            value: "ambohitrimanjaka",
            label: "Ambohitrimanjaka"
        },

        {
            value: "ampanotokana",
            label: "Ampanotokana"
        },

        {
            value: "androidhibe",
            label: "Androidhibe"
        },

        {
            value: "antehiroka",
            label: "Antehiroka"
        },

        {
            value: "aovaratsy",
            label: "Aovaratsy"
        },

        {
            value: "fenoarivo",
            label: "Fenoarivo"
        },

        {
            value: "fihaonana",
            label: "Fihaonana"
        },

        {
            value: "iaborano",
            label: "Iaborano"
        },

        {
            value: "ivato",
            label: "Ivato"
        },

        {
            value: "mananjara",
            label: "Mananjara"
        },

        {
            value: "merimandroso",
            label: "Merimandroso"
        },

        {
            value: "mahitsy",
            label: "Mahitsy"
        },

        {
            value: "talatamaty",
            label: "Talatamaty"
        }

    ],


    antananarivo_atsimondrano: [

        {
            value: "alakamisy_fenioarivo",
            label: "Alakamisy Fenoarivo"
        },

        {
            value: "andoharanofotsy",
            label: "Andoharanofotsy"
        },

        {
            value: "ampitatafika",
            label: "Ampitatafika"
        },

        {
            value: "ankadimbahoaka",
            label: "Ankadimbahoaka"
        },

        {
            value: "fenoarivo_atsimondrano",
            label: "Fenoarivo"
        }

    ],


    antananarivo_avaradrano: [

        {
            value: "alasia",
            label: "Alasia"
        },

        {
            value: "alasora",
            label: "Alasora"
        },

        {
            value: "ambohidrabiby",
            label: "Ambohidrabiby"
        },

        {
            value: "ankadinandriana",
            label: "Ankadinandriana"
        }

    ]

};


/*
 * =========================================================
 * NOMS AFFICHÉS DES DISTRICTS
 * =========================================================
 */

const districtLabels = {

    ambohidratrimo:
        "Ambohidratrimo",

    antananarivo_atsimondrano:
        "Antananarivo Atsimondrano",

    antananarivo_avaradrano:
        "Antananarivo Avaradrano"

};


/*
 * =========================================================
 * NOMS AFFICHÉS DES ACTIONS
 * =========================================================
 */

const actionLabels = {

    check_in:
        "Check in",

    check_out:
        "Check out"

};


/*
 * =========================================================
 * NOMS AFFICHÉS DES SALLES
 * =========================================================
 */

const salleLabels = {

    salle_1:
        "Salle 1",

    salle_2:
        "Salle 2",

    salle_3:
        "Salle 3"

};


/* =========================================================
   INITIALISATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "Application chargée"
        );


        /*
         * Boutons
         */

        document
            .getElementById("loginButton")
            .addEventListener(
                "click",
                login
            );


        document
            .getElementById("passwordInput")
            .addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        login();

                    }

                }
            );


        document
            .getElementById("districtSelect")
            .addEventListener(
                "change",
                districtChanged
            );


        document
            .getElementById("startButton")
            .addEventListener(
                "click",
                saveSettings
            );


        document
            .getElementById("continueButton")
            .addEventListener(
                "click",
                openKoboForm
            );


        document
            .getElementById("rescanButton")
            .addEventListener(
                "click",
                restartScanner
            );


        document
            .getElementById("logoutButton")
            .addEventListener(
                "click",
                logout
            );


        /*
         * Vérifier la session
         */

        const authenticated =
            sessionStorage.getItem(
                AUTH_KEY
            );


        const savedSettings =
            getSavedSettings();


        /*
         * CAS 1
         *
         * Retour depuis Kobo :
         *
         * authentifié + paramètres déjà
         * enregistrés.
         *
         * On va directement au scanner.
         */

        if (
            authenticated === "true" &&
            savedSettings !== null
        ) {

            showScanner();

            return;

        }


        /*
         * CAS 2
         *
         * Déjà authentifié mais
         * paramètres non enregistrés.
         */

        if (
            authenticated === "true"
        ) {

            showSettings();

            return;

        }


        /*
         * CAS 3
         *
         * Première ouverture.
         */

        showLogin();

    }
);


/* =========================================================
   CONNEXION
   ========================================================= */

function login() {

    const passwordInput =
        document.getElementById(
            "passwordInput"
        );

    const loginError =
        document.getElementById(
            "loginError"
        );


    const password =
        passwordInput.value;


    if (
        password === PASSWORD
    ) {

        console.log(
            "Mot de passe correct"
        );


        /*
         * Mémoriser l'authentification
         * pendant cette session.
         */

        sessionStorage.setItem(
            AUTH_KEY,
            "true"
        );


        passwordInput.value = "";

        loginError.textContent = "";


        /*
         * Afficher les paramètres
         */

        showSettings();

    }

    else {

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

    document
        .getElementById("loginScreen")
        .style.display = "flex";


    document
        .getElementById("settingsScreen")
        .style.display = "none";


    document
        .getElementById("scannerScreen")
        .style.display = "none";

}


/* =========================================================
   AFFICHER PARAMÈTRES
   ========================================================= */

function showSettings() {

    document
        .getElementById("loginScreen")
        .style.display = "none";


    document
        .getElementById("settingsScreen")
        .style.display = "flex";


    document
        .getElementById("scannerScreen")
        .style.display = "none";


    /*
     * Si paramètres déjà enregistrés,
     * les afficher.
     */

    const settings =
        getSavedSettings();


    if (
        settings !== null
    ) {

        document
            .getElementById("districtSelect")
            .value =
            settings.district;


        districtChanged();


        document
            .getElementById("communeSelect")
            .value =
            settings.commune;


        document
            .getElementById("actionSelect")
            .value =
            settings.action;


        document
            .getElementById("salleSelect")
            .value =
            settings.salle;

    }

}


/* =========================================================
   DISTRICT CHANGÉ
   ========================================================= */

function districtChanged() {

    const district =
        document
            .getElementById("districtSelect")
            .value;


    const communeSelect =
        document
            .getElementById("communeSelect");


    /*
     * Réinitialiser
     */

    communeSelect.innerHTML = "";


    /*
     * Aucun district
     */

    if (
        district === ""
    ) {

        communeSelect.disabled =
            true;


        const option =
            document.createElement(
                "option"
            );


        option.value = "";

        option.textContent =
            "-- Sélectionner d'abord le District --";


        communeSelect.appendChild(
            option
        );


        return;

    }


    /*
     * Activer commune
     */

    communeSelect.disabled =
        false;


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        "-- Sélectionner la Commune --";


    communeSelect.appendChild(
        defaultOption
    );


    /*
     * Ajouter les communes
     */

    const list =
        communes[district] || [];


    list.forEach(
        function (commune) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                commune.value;


            option.textContent =
                commune.label;


            communeSelect.appendChild(
                option
            );

        }
    );

}


/* =========================================================
   ENREGISTRER LES PARAMÈTRES
   ========================================================= */

function saveSettings() {

    const district =
        document
            .getElementById("districtSelect")
            .value;


    const commune =
        document
            .getElementById("communeSelect")
            .value;


    const action =
        document
            .getElementById("actionSelect")
            .value;


    const salle =
        document
            .getElementById("salleSelect")
            .value;


    const error =
        document
            .getElementById("settingsError");


    /*
     * Vérification
     */

    if (
        district === "" ||
        commune === "" ||
        action === "" ||
        salle === ""
    ) {

        error.textContent =
            "❌ Veuillez remplir tous les champs.";

        return;

    }


    error.textContent = "";


    /*
     * Sauvegarder
     */

    const settings = {

        district:
            district,

        commune:
            commune,

        action:
            action,

        salle:
            salle

    };


    sessionStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
    );


    console.log(
        "Paramètres enregistrés :",
        settings
    );


    /*
     * Aller au scanner
     */

    showScanner();

}


/* =========================================================
   RÉCUPÉRER LES PARAMÈTRES
   ========================================================= */

function getSavedSettings() {

    const data =
        sessionStorage.getItem(
            SETTINGS_KEY
        );


    if (
        !data
    ) {

        return null;

    }


    try {

        return JSON.parse(data);

    }

    catch (error) {

        console.error(
            "Erreur paramètres :",
            error
        );

        return null;

    }

}


/* =========================================================
   AFFICHER SCANNER
   ========================================================= */

function showScanner() {

    const settings =
        getSavedSettings();


    if (
        settings === null
    ) {

        showSettings();

        return;

    }


    document
        .getElementById("loginScreen")
        .style.display = "none";


    document
        .getElementById("settingsScreen")
        .style.display = "none";


    document
        .getElementById("scannerScreen")
        .style.display = "block";


    /*
     * Afficher les informations
     */

    document
        .getElementById("currentDistrict")
        .textContent =
        districtLabels[
            settings.district
        ] || settings.district;


    /*
     * Chercher label commune
     */

    const communeList =
        communes[
            settings.district
        ] || [];


    const communeObject =
        communeList.find(
            function (item) {

                return (
                    item.value ===
                    settings.commune
                );

            }
        );


    document
        .getElementById("currentCommune")
        .textContent =
        communeObject
            ? communeObject.label
            : settings.commune;


    document
        .getElementById("currentAction")
        .textContent =
        actionLabels[
            settings.action
        ] || settings.action;


    document
        .getElementById("currentSalle")
        .textContent =
        salleLabels[
            settings.salle
        ] || settings.salle;


    /*
     * Démarrer caméra
     */

    startScanner();

}


/* =========================================================
   DÉMARRER SCANNER
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
     * Nettoyage
     */

    reader.innerHTML = "";


    result.classList.add(
        "hidden"
    );


    scannedCode = null;


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
     * Vérifier bibliothèque
     */

    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        status.textContent =
            "❌ Le scanner QR n'a pas pu être chargé.";

        return;

    }


    status.textContent =
        "📷 Demande d'accès à la caméra...";


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
     * Caméra arrière
     */

    scanner.start(

        {
            facingMode:
                "environment"
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

    document
        .getElementById("code")
        .textContent =
        decodedText;


    document
        .getElementById("status")
        .textContent =
        "✅ QR code détecté.";


    document
        .getElementById("result")
        .classList.remove(
            "hidden"
        );

}


/* =========================================================
   ERREUR DE LECTURE
   ========================================================= */

function onScanFailure(
    error
) {

    /*
     * Ne rien afficher.
     *
     * Cette fonction est appelée
     * pendant la recherche du QR.
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


    if (
        error &&
        (
            error.name ===
            "NotAllowedError" ||

            String(error).includes(
                "NotAllowedError"
            )
        )
    ) {

        status.textContent =
            "📷 Accès caméra refusé. " +
            "Autorisez la caméra pour ce site " +
            "dans Safari puis rechargez la page.";

        return;

    }


    if (
        error &&
        (
            error.name ===
            "NotReadableError" ||

            String(error).includes(
                "NotReadableError"
            )
        )
    ) {

        status.textContent =
            "📷 La caméra est déjà utilisée " +
            "par une autre application.";

        return;

    }


    status.textContent =
        "❌ Impossible d'accéder à la caméra.";

}


/* =========================================================
   ARRÊTER SCANNER
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
                        "Erreur arrêt caméra :",
                        error
                    );

                    scanning = false;

                }
            );

    }

}


/* =========================================================
   ENVOYER VERS KOBO
   ========================================================= */

function openKoboForm() {

    if (
        !scannedCode
    ) {

        alert(
            "Aucun QR code n'a été détecté."
        );

        return;

    }


    /*
     * Récupérer les paramètres
     */

    const settings =
        getSavedSettings();


    if (
        settings === null
    ) {

        alert(
            "Les paramètres de session sont absents."
        );

        showSettings();

        return;

    }


    /*
     * Vérifier l'URL Kobo
     */

    if (
        KOBO_FORM_URL.includes(
            "TON_FORM_ID"
        )
    ) {

        alert(
            "⚠️ Configurez KOBO_FORM_URL dans app.js."
        );

        return;

    }


    /*
     * Créer paramètres URL
     */

    const params =
        new URLSearchParams();


    /*
     * ====================================================
     * DISTRICT
     * ====================================================
     */

    params.append(
        "d[district]",
        settings.district
    );


    /*
     * ====================================================
     * COMMUNE
     * ====================================================
     */

    params.append(
        "d[commune]",
        settings.commune
    );


    /*
     * ====================================================
     * ACTION
     * ====================================================
     */

    params.append(
        "d[action]",
        settings.action
    );


    /*
     * ====================================================
     * SALLE
     * ====================================================
     */

    params.append(
        "d[salle]",
        settings.salle
    );


    /*
     * ====================================================
     * QR CODE
     * ====================================================
     *
     * IMPORTANT :
     *
     * scan_qr se trouve dans le groupe
     * Fiche_de_presence.
     *
     * On utilise donc :
     *
     * d[Fiche_de_presence/scan_qr]
     *
     */

    params.append(
        "d[Fiche_de_presence/scan_qr]",
        scannedCode
    );


    /*
     * ====================================================
     * URL DE RETOUR
     * ====================================================
     */

    const returnUrl =
        window.location.origin +
        window.location.pathname;


    params.append(
        "return_url",
        returnUrl
    );


    /*
     * Construire URL
     */

    const koboUrl =
        KOBO_FORM_URL +
        "?" +
        params.toString();


    console.log(
        "URL envoyée à Kobo :",
        koboUrl
    );


    /*
     * Aller dans Kobo
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


    document
        .getElementById("code")
        .textContent = "";


    document
        .getElementById("result")
        .classList.add(
            "hidden"
        );


    document
        .getElementById("reader")
        .innerHTML = "";


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
        "Déconnexion"
    );


    /*
     * Arrêter caméra
     */

    stopScanner();


    /*
     * Effacer mot de passe
     */

    sessionStorage.removeItem(
        AUTH_KEY
    );


    /*
     * Effacer District,
     * Commune, Action et Salle
     */

    sessionStorage.removeItem(
        SETTINGS_KEY
    );


    /*
     * Réinitialiser variables
     */

    scannedCode = null;


    /*
     * Retour connexion
     */

    showLogin();


    /*
     * Focus mot de passe
     */

    document
        .getElementById("passwordInput")
        .focus();

}
