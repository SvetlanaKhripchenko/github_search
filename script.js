'use strict';

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const repositoriesList = document.querySelector('.repositories');


function createElement(title, description, url, stars) {
    const repository = document.createElement('div');
    repository.className = 'repository';

    repository.innerHTML = `
        <h1><a target="_blank" href="${url}">${title}</a></h1>
        <p class="description">${description}</p>
        <h4>Звезд: <b class="star">${stars}</b></h4>
    `;

    return repository;
}

function createErrorElement(text) {
    const error = document.createElement('h2');
    error.className = 'error';
    error.innerHTML = text;

    return error;
}


async function getRepositories(text) {
    const url = `https://api.github.com/search/repositories?q=${text}`;
    const result = await fetch(url);

    result.json().then(res => {
        const reps = res['items'];
        repositoriesList.innerHTML = '';

        if (reps['length'] === 0) {
            const text = 'Ничего не найдено';
            repositoriesList.append(createErrorElement(text));
        } else {
            for (let rep of reps.slice(0, 10)) {
                const title = rep['full_name'];
                const description = rep['description'];
                const url = rep['html_url'];
                const stars = rep['stargazers_count'];

                repositoriesList.append(createElement(title, description, url, stars));
            }
        }
    }).catch(_ => {
        const text = 'Произошла ошибка!';
        repositoriesList.append(createErrorElement(text));
    }
    );
}


searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    getRepositories(searchInput.value);
});
