document.getElementById("inscriptionForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    let nom = document.getElementById("nom").value;
    let prenom = document.getElementById("prenom").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    let data = `${nom}, ${prenom}, ${email}, ${password}\n`;

    try {
        // Création du fichier Blob
        let blob = new Blob([data], { type: "text/plain" });

        // Création d'un lien de téléchargement
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "users.txt"; // Nom du fichier
        document.body.appendChild(a);
        
        // Vérification avant de cliquer
        if (a.href) {
            a.click();
            setTimeout(() => {
                alert("✅ Le fichier a été téléchargé avec succès !");
            }, 1000);
        } else {
            throw new Error("❌ Erreur lors de la génération du fichier.");
        }

        document.body.removeChild(a);
    } catch (error) {
        console.error("Erreur :", error);
        alert("⚠️ Échec du téléchargement du fichier.");
    }
});
