import api from './api';

class App {
    constructor() {
        this.drivers = [];
        this.formEl = document.getElementById('driver-form');
        this.listEl = document.getElementById('driver-list');
        this.inputEl = document.querySelector('input[name=driver]');
        this.registerHandlers();
    }

    registerHandlers() {
        this.formEl.onsubmit = event => this.addDriver(event);
    }

    setLoading(loading = true) {
        if (loading) {
            let loadingEl = document.createElement('span');
            loadingEl.appendChild(document.createTextNode('Loading driver...'));
            loadingEl.setAttribute('id', 'loading');
            this.formEl.appendChild(loadingEl);
        } else {
            document.getElementById('loading').remove();
        }
    }

    async addDriver(event) {
        event.preventDefault();

        const driverName = this.inputEl.value;
        if (driverName.length === 0)
            return;

        this.setLoading(true);

        const options = {
            params: {
                search: driverName,
            },
            headers: {
                "content-type": "application/octet-stream",
                "x-rapidapi-host": "api-formula-1.p.rapidapi.com",
                "x-rapidapi-key": process.env.x_rapidapi_key,
                "useQueryString": true
            }
        };

        try {

            const response = await api.get(`drivers`, options);

            console.log(response.data.response);

            const { image, name, nationality, teams } = response.data.response[0];

            // console.log(image, name, nationality, teams);

            const team = teams[0].team.name;
            const team_url = teams[0].team.logo;

            // console.log(image, name, nationality, team, team_url);

            this.drivers.push({
                name,
                nationality,
                image,
                team,
                team_url,
            });

            this.inputEl.value = '';

            this.render();
        } catch (err) {
            alert('Driver not found!');
        }

        this.setLoading(false);
    }

    render() {
        this.listEl.innerHTML = '';

        this.drivers.forEach(driver => {
            let imgEl = document.createElement('img');
            imgEl.setAttribute('src', driver.image);

            let nameEl = document.createElement('strong');
            nameEl.appendChild(document.createTextNode(driver.name));

            let nationalityEl = document.createElement('p');
            nationalityEl.appendChild(document.createTextNode(driver.nationality));

            let teamEl = document.createElement('a');
            teamEl.setAttribute('target', '_blank');
            teamEl.setAttribute('href', driver.team_url);
            teamEl.appendChild(document.createTextNode(driver.team));

            let listItemEl = document.createElement('li');
            listItemEl.appendChild(imgEl);
            listItemEl.appendChild(nameEl);
            listItemEl.appendChild(nationalityEl);
            listItemEl.appendChild(teamEl);

            this.listEl.appendChild(listItemEl);

        })
    }
};

new App();