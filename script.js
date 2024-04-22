const apiKey = "e2cf3ef830ea82bf925fc3d6eed026a5";
const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const ctx = document.getElementById('myChart');
const dateInput = document.querySelector(".date");
const weatherIcon = document.querySelector(".weather-icon");

const dropdowns = document.querySelectorAll(".dropdown");
const dropdown = document.querySelector(".dropdown");
const selectedDate = document.querySelector('.selected');
const options = document.querySelectorAll('.menu li');

var data_temp = []



function unixTimeToMonthDay(unixTime) {
    const milliseconds = unixTime * 1000;
    const date = new Date(milliseconds);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${month}-${day}`;
}

async function updateDropdownOptions(city) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    if (response.ok) {
        const data = await response.json();
        options.forEach((option, index) => {
            date_index = 8*(index)
            const date = unixTimeToMonthDay(data.list[date_index].dt);
            option.textContent = date;
        });
    }
}
  
async function checkWeather(city, date_index) {
    const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
    console.log(date_index)
    if(response.status == 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    } else{
        var data = await response.json();
        const weatherData = data.list[date_index];
        document.querySelector(".city").innerHTML = data.city.name;
        document.querySelector(".temp").innerHTML = Math.round(weatherData.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = weatherData.main.humidity + "%";
        document.querySelector(".wind").innerHTML = weatherData.wind.speed + " km/h ";
        
        console.log(weatherData);

        switch (weatherData.weather[0].main) {
    
            case "Clouds":
                weatherIcon.src = "images/clouds.png";
                break;
            case "Clear":
                weatherIcon.src = "images/clear.png";
                break;
            case "Rain":
                weatherIcon.src = "images/rain.png";
                break;
            case "Drizzle":
                weatherIcon.src = "images/drizzle.png";
                break;
            case "Mist":
                weatherIcon.src = "images/mist.png";
                break;
        }

        data_temp = [data.list[date_index-1].main.temp, data.list[date_index].main.temp, data.list[date_index+1].main.temp, data.list[date_index+2].main.temp, data.list[date_index+3].main.temp]
        createChart();
        
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
    }
    
}

dropdowns.forEach(dropdown => {
    const select = dropdown.querySelector(".select");
    const menu = dropdown.querySelector('.menu');
    const options = dropdown.querySelectorAll('.menu li'); 
    const selected = dropdown.querySelector('.selected');

    select.addEventListener('click', () =>{
        select.classList.toggle('select-clicked');
        menu.classList.toggle('menu-open');
    });

    
    options.forEach((option, index) => {
        let date_index = 8*(index)+1
        console.log(date_index)
        option.addEventListener('click', (() => {
            return (date_index => {
                return () => {
                    selected.innerText = option.innerText;
                    console.log(date_index)
                    checkWeather(searchBox.value, date_index);
                    select.classList.remove('select-clicked');
                    menu.classList.remove('menu-open');
                    options.forEach(option => {
                        option.classList.remove('active');
                    });
                    option.classList.add('active');
                };
            })(date_index);
        })());
    });
});


function createChart() {
    if (window.myChart instanceof Chart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['09:00','12:00', '15:00', '18:00', '21:00'],
            datasets: [{
                label: 'temperature',
                data: data_temp,
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                },
                x: {
                    display: true,
                    title: "Day",
                }
            }
        }
    });
}


searchBox.addEventListener("mouseover", async ()=> {
    const city = "bangkok";
    await updateDropdownOptions(city);
});

searchBtn.addEventListener("click", async ()=> {
    const city = searchBox.value;
    await updateDropdownOptions(city);
    await checkWeather(city, 1);
});
