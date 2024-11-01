const apiKey = 'ee04899601384c3cb2c162805242110';
let city = 'Bangkok';
const citySelect = document.getElementById('city-select');

// ฟังก์ชันสำหรับเรียกข้อมูลจาก WeatherAPI
async function showWeather() {
    try {
        const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
        const response = await fetch(url);
        const data = await response.json();
        showDataToUI(data);
    } catch (error) {
        console.log(error);
    }
}

// ฟังก์ชันสำหรับแสดงข้อมูลใน UI
function showDataToUI(data) {
    const cityElement = document.getElementById('city');
    const state = document.getElementById('state');
    const weather = document.getElementById('weather');
    const status = document.getElementById('status');
    const humidity = document.getElementById('humidity');
    const wind = document.getElementById('wind');

    cityElement.innerText = data.location.name;
    state.innerText = data.location.country;
    weather.children[0].innerHTML = `${data.current.temp_c} C&deg;`;
    weather.children[1].innerHTML = `Min : ${data.current.temp_c} C&deg; Max : ${data.current.temp_c} C&deg;`;
    status.innerText = data.current.condition.text;
    humidity.innerText = `Humidity: ${data.current.humidity}%`;
    wind.innerText = `Wind: ${data.current.wind_kph} km/h`;
}

// ฟังก์ชันสำหรับการเปลี่ยนเมือง
citySelect.addEventListener('change', (e) => {
    city = e.target.value; // เปลี่ยนเมืองตามการเลือก
    showWeather(); // เรียกฟังก์ชันอัปเดตข้อมูล
});

showWeather(); // เรียกข้อมูลครั้งแรกสำหรับเมืองเริ่มต้น
