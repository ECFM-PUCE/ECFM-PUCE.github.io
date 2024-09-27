// Definir la URL base para GitHub y Colab
const baseURL = `https://github.com/${repoOwner}/${repoName}/blob/main/`;
const baseURLcolab = `https://colab.research.google.com/github/${repoOwner}/${repoName}/blob/main/`;

// Obtener los elementos DOM una vez
const contributorsList = document.getElementById('contributors-list');
const commitsList = document.getElementById('commits-list');

// Función para hacer peticiones a la API de GitHub
async function fetchFromApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching from API: ${error}`);
        return null;  // Retorna null en caso de error
    }
}

// Función para obtener el perfil de un colaborador
async function fetchContributorProfile(contributor) {
    const profile = await fetchFromApi(contributor.url);
    return profile ? (profile.name || contributor.login) : contributor.login;
}

// Función para agregar colaboradores a la lista
async function fetchContributors() {
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contributors`;
    const contributors = await fetchFromApi(apiUrl);

    if (!contributors) return;  // Termina si hubo un error

    contributors
        .filter(contributor => contributor.login !== 'actions-user') // Excluir 'actions-user'
        .forEach(async contributor => {
            const name = await fetchContributorProfile(contributor);
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="${contributor.html_url}" target="_blank">${name}</a>
                (${contributor.contributions} contribuciones)
            `;
            contributorsList.appendChild(listItem);
        });
}

// Función para agregar commits a la lista
async function fetchRecentCommits() {
    const commitsApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
    const commits = await fetchFromApi(commitsApiUrl);

    if (!commits) return;  // Termina si hubo un error

    const recentCommits = commits
        .filter(commit => commit.commit.author.name !== 'GitHub Action')  // Filtra los commits de 'GitHub Action'
        .slice(0, 5);  // Limita a los últimos 5 commits

    recentCommits.forEach(commit => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${commit.commit.message}<br>
            <small>Autor: ${commit.commit.author.name} | Fecha: ${new Date(commit.commit.author.date).toLocaleDateString()} | 
            <a href="${commit.html_url}" target="_blank">Ver cambios</a></small>
        `;
        commitsList.appendChild(listItem);
    });
}

// Función para agregar enlaces dinámicos (DRY - Don't Repeat Yourself)
function addDynamicLinks(selector, base) {
    document.querySelectorAll(selector).forEach(item => {
        const link = item.getAttribute('data-link');
        const aTag = document.createElement('a');
        aTag.href = base + link;
        aTag.appendChild(item.cloneNode(true));
        item.replaceWith(aTag);
    });
}

// Llamadas iniciales
fetchContributors();
fetchRecentCommits();
addDynamicLinks('.item', baseURL);
addDynamicLinks('.item-colab', baseURLcolab);
