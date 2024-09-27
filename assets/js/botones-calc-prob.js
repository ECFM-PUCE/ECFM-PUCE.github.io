// Funcionalidad para el botón de Ayuda
document.getElementById("toggleHelpButton").onclick = function () {
    var helpPanel = document.getElementById("helpPanel");
    var masPanel = document.getElementById("masPanel");

    // Mostrar el panel de ayuda y ocultar el de tabla si está visible
    if (helpPanel.style.display === "none" || helpPanel.style.display === "") {
        helpPanel.style.display = "block";
        masPanel.style.display = "none";  // Ocultar tabla de valores
    } else {
        helpPanel.style.display = "none";   // Ocultar ayuda
    }
}

// Funcionalidad para el botón de Tabla de Valores
document.getElementById("toggleTableButton").onclick = function () {
    var helpPanel = document.getElementById("helpPanel");
    var masPanel = document.getElementById("masPanel");

    // Mostrar la tabla y ocultar el panel de ayuda si está visible
    if (masPanel.style.display === "none" || masPanel.style.display === "") {
        masPanel.style.display = "block";
        helpPanel.style.display = "none";  // Ocultar ayuda
    } else {
        masPanel.style.display = "none";  // Ocultar tabla de valores
    }
}