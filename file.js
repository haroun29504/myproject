// Variable globale pour stocker le handle du fichier
let fileHandle = null;

// Fonction pour obtenir ou créer le handle du fichier
async function getFileHandle() {
  if (!fileHandle) {
    const options = {
      types: [{
        description: 'Text Files',
        accept: { 'text/plain': ['.txt'] }
      }]
    };
    try {
      fileHandle = await window.showSaveFilePicker(options);
    } catch (error) {
      console.error("L'utilisateur a peut-être annulé la sélection du fichier.", error);
      throw error;
    }
  }
  return fileHandle;
}

// Fonction pour écrire du contenu dans le fichier
async function writeDataToFile(content) {
  try {
    const handle = await getFileHandle();
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    console.log("Fichier mis à jour avec succès.");
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier :", error);
  }
}

// Fonction pour construire le contenu du fichier avec les données du localStorage et de l'API
async function buildFileContent() {
  let users = JSON.parse(localStorage.getItem("users")) || [];
  let fileContent = "Liste des utilisateurs enregistrés :\n\n";
  
  if (users.length === 0) {
    fileContent += "Aucune inscription enregistrée.\n\n";
  } else {
    users.forEach((user, index) => {
      fileContent += `Inscription ${index + 1}:\n`;
      fileContent += `Nom: ${user.nom}\n`;
      fileContent += `Prénom: ${user.prenom}\n`;
      fileContent += `Email: ${user.email}\n`;
      fileContent += `Mot de passe: ${user.password}\n\n`;
    });
  }
  
  // Récupérer les données depuis l'API
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    if (!response.ok) {
      throw new Error("Erreur HTTP " + response.status);
    }
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données de l'API :", error);
    fileContent += "Erreur lors de la récupération des données de l'API : " + error.message + "\n";
  }
  
  return fileContent;
}

// Gestionnaire de soumission du formulaire
document.getElementById("inscriptionForm").addEventListener("submit", async function(event) {
  event.preventDefault();

  let nom = document.getElementById("nom").value.trim();
  let prenom = document.getElementById("prenom").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!nom || !prenom || !email || !password) {
    alert("❌ Veuillez remplir tous les champs !");
    return;
  }

  // Récupérer les utilisateurs existants ou initialiser un tableau vide
  let users = JSON.parse(localStorage.getItem("users")) || [];
  users.push({ nom, prenom, email, password });
  localStorage.setItem("users", JSON.stringify(users));

  // Construire le contenu du fichier (avec données locales + API)
  const fileContent = await buildFileContent();
  
  // Écrire dans le fichier
  await writeDataToFile(fileContent);

  alert("✅ Les données ont été enregistrées et le fichier a été mis à jour !");
  document.getElementById("inscriptionForm").reset();
});
