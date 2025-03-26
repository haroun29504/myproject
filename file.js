localStorage.clear();
// Lors de la soumission du formulaire, on enregistre les données dans localStorage.
document.getElementById("inscriptionForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let nom = document.getElementById("nom").value.trim();
    let prenom = document.getElementById("prenom").value.trim();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    if (!nom || !prenom || !email || !password) {
        alert("❌ Veuillez remplir tous les champs !");
        return;
    }

    // Vérifier si les données sont déjà enregistrées
    let users = JSON.parse(localStorage.getItem("users")) || [];
    let exists = users.some(user => user.email === email);

    if (exists) {
        alert("⚠️ Cet utilisateur est déjà enregistré !");
        return;
    }

    // Ajouter l'utilisateur et sauvegarder
    users.push({ nom, prenom, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    console.log("✅ Données enregistrées :", users);
    alert("✅ Les données ont été enregistrées localement !");
    document.getElementById("inscriptionForm").reset();
});

// Fonction pour exporter une seule fois les données enregistrées en un fichier texte unique.
let fileGenerated = false; // Variable pour empêcher plusieurs téléchargements

document.getElementById("exportBtn").addEventListener("click", function() {
    if (fileGenerated) {
        alert("⚠️ Le fichier 'users.txt' a déjà été généré !");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.length === 0) {
        alert("⚠️ Aucune donnée à exporter !");
        return;
    }

    let fileContent = "Liste des utilisateurs enregistrés :\n\n";
    users.forEach((user, index) => {
        fileContent += `Inscription ${index + 1}:\n`;
        fileContent += `Nom: ${user.nom}\n`;
        fileContent += `Prénom: ${user.prenom}\n`;
        fileContent += `Email: ${user.email}\n`;
        fileContent += `Mot de passe: ${user.password}\n\n`;
    });

    try {
        console.log("📂 Contenu du fichier :\n", fileContent);

        let blob = new Blob([fileContent], { type: "text/plain" });

        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "users.txt";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        fileGenerated = true; // Empêcher les futures exportations

        setTimeout(() => {
            alert("✅ Le fichier 'users.txt' a été généré avec succès !");
        }, 1000);
    } catch (error) {
        console.error("❌ Erreur lors de la génération du fichier :", error);
        alert("⚠️ Échec de l'exportation du fichier !");
    }
});
