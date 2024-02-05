// ########################################################
// CONSTANTS
// Time
const timeElement = document.getElementById("time");
const exactTimeElement = document.getElementById("exactTime");
const dateElement = document.getElementById("date");
// month related function returns 0-11 number, list below turns it into a string
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// Weather
const weatherIcon = document.getElementById("weather-icon");
const city =  document.querySelector(".city");
const humidity =  document.querySelector(".humidity");
const wind =  document.querySelector(".wind");

// Carousel
const carousel = document.getElementById('image-carousel');
const pointContainer = document.querySelector(".img-num")
// empty list to add points
const imgPoints = [];
const authour = document.getElementById("authour");
// hard coded list for the creators of the code snippets
const creators = ["Matthew P", "Mithulan N", "Tully and Harry"]

// Event Carousel
const eventCarousel = document.getElementById("event-carousel");

// Timetable
const periodTimeTableTitle = document.getElementById("timetable-period-title");
const timeTitle = document.getElementById("timetable-time-title");
const periodTimetable = document.getElementById("timetable-period");
const time = document.getElementById("timetable-time");

// Library Status
const periodTitle = document.getElementById("lib-period-title");
const statusTitle = document.getElementById("lib-status-title");
const period = document.getElementById("lib-period");
const status = document.getElementById("lib-status");

// Club List
const clubListContainer = document.getElementById("club-list-container");
const clubSlide = document.querySelector(".club-slide");

// ########################################################
// TIME ---------------------------------------------------
// Puts a zero in front of single digit numbers
function padNumber(num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
}

// Updates the time element to display current time
function updateTime() {
    let currentDate = new Date();
    let hour = padNumber(currentDate.getHours());
    let min = padNumber(currentDate.getMinutes());
    let sec = padNumber(currentDate.getSeconds());
    let day = padNumber(currentDate.getDate());
    // No pad to ensure it works as an index later on
    let month = currentDate.getMonth();
    let year = padNumber(currentDate.getFullYear());

    month = months[month];

    exactTimeElement.innerText = `${hour}:${min}:${sec}`;

    if (dateElement) {
        dateElement.innerText = `${month} ${day}, ${year}`;
    }
}

// Update the time every second
setInterval(updateTime, 1000);

// ########################################################
// WEATHER ------------------------------------------------
// https://www.youtube.com/watch?v=MIYQR-Ybrn4
// Safe Keeping
const apiKey = "bc214ede05e62483f1293f1a1ad53750";
// Api Url - shortened
// id=6122091 is the id for Richmond Hill, ON
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?id=6122091&units=metric&appid=";
// test other cities using q=city/region/countryName
// const apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=california&units=metric&appid=";

// Check the weather repeatedly
async function checkWeather(){
    const response = await fetch(apiUrl + apiKey);
    const weatherData = await response.json();

    // update the weather info for richmond hill
    // temp is always displayed
    document.querySelector(".temp").innerHTML = Math.round(weatherData.main.temp) + "°C";

    // https://medium.com/@madhav201singh/uncaught-typeerror-cannot-set-properties-of-null-setting-inner-html-solutions-41726496d355
    /* I needed to make sure i could update the weather without loading humidity, city and more
    this website saved my life.*/
    if (city) {
        city.innerHTML = weatherData.name;
        humidity.innerHTML = weatherData.main.humidity + "%";
        wind.innerHTML = weatherData.wind.speed + " km/h";
    }

    // part of json with weather
    let currentWeather = weatherData.weather[0].main

    // change weather icon, there are 5 predefined weather types
    if (currentWeather == "Clouds") {
        weatherIcon.className = "fa-solid fa-cloud";
    }
    else if (currentWeather == "Clear") {
        weatherIcon.className = "fa-solid fa-sun";
    }
    else if (currentWeather == "Rain") {
        weatherIcon.className = "fa-solid fa-cloud-showers-heavy";
    }
    else if (currentWeather == "Drizzle") {
        weatherIcon.className = "fa-solid fa-rain";
    }
    else if (currentWeather == "Mist") {
        weatherIcon.className = "fa-solid fa-smog";
    }
}

// Check weather every 10 sec
setInterval(checkWeather, 1000);

// ########################################################
// AUTO-SCROLL CAROUSEL -----------------------------------
// create a point for every image in carousel
if (carousel){
    for (let project = 0; project < carousel.children.length; project++) {
        let point = document.createElement('div');
        point.className = ("point");
        point.id = ("point-img-" + (project + 1));
        // https://www.w3schools.com/jsref/jsref_push.asp
        imgPoints.push(point);
        pointContainer.append(point);
    }

    // set first authour
    authour.innerHTML = creators[0]
}

// reset index to 0
let currentIndex = 0;

// Move the image
function showImage(index) {
    const translateValue = -index * 100 + '%';
    // move the whole slider left or right
    carousel.style.transform = 'translateX(' + translateValue + ')';

    // find the current point for the displayed image and change colour to green
    for (let imgNum = 0; imgNum < imgPoints.length; imgNum++) {
        if (imgNum == index) {
            imgPoints[imgNum].style.backgroundColor = "#25edb8";
        } else {
            imgPoints[imgNum].style.backgroundColor = "white";
        }
    }
}

// Iterate to next image
function nextImage() {
    currentIndex = (currentIndex + 1) % carousel.children.length;
    showImage(currentIndex);

    // change authour to match next image
    authour.innerHTML = creators[currentIndex];
}

// Auto-scroll every 5 seconds
if (carousel) {
    setInterval(nextImage, 5000);
}

// ########################################################
// EVENT STATUS -------------------------------------------
// https://www.youtube.com/watch?v=vtq2xTWK7h4&t=672s
let eventSheetId = '1EkJM10zn2he2M3pSF-5g7_2Azdt3GgF-lvP2yKjgoYo';
let eventSheetTitle = 'event-list';
// Sheet Range for data
let eventSheetRange = 'B2:C101';

// Uses gvis, Google Visualization API
let eventUrl = ('https://docs.google.com/spreadsheets/d/' + eventSheetId + '/gviz/tq?sheet=' + eventSheetTitle + '&range=' + eventSheetRange);

fetch(eventUrl)
.then(res => res.text())
.then(rep => {
    // Removes unecessary characters
    const eventData = JSON.parse(rep.substr(47).slice(0,-2));

    // Navigation through the table goes as:
    // Table > rows > columns > values
    let eventLength = eventData.table.rows.length;

    // if event carousel is displayed
    if (eventCarousel) {
        for (let eventNum = 0; eventNum < eventLength; eventNum++) {
            // create div for event carousel to add events
            let newEvent = document.createElement('div');
            newEvent.id = ("event-"+eventNum);
            newEvent.className = "event";
            eventCarousel.append(newEvent);

            // create both a h2 and a p for each div for the text
            // https://stackoverflow.com/questions/23274274/change-text-inside-h2-text-i-would-change-h2-element-using-javascript
            let newTitle = document.createElement('h2');
            let newDescription = document.createElement('p');
            newTitle.textContent = eventData.table.rows[eventNum].c[0].v;
            newDescription.textContent = eventData.table.rows[eventNum].c[1].v;
            newTitle.className = "event-title";
            newDescription.className = "event-description";

            // add texts to event div
            newEvent.append(newTitle);
            newEvent.append(newDescription);
        }

        return true;
    } 
})

// ########################################################
// AUTO-SCROLL EVENT --------------------------------------
// reset index
let eventNumber = 0;

// Move the image
function showEvent(index) {
    const eventTranslateValue = -index * 100 + '%';
    eventCarousel.style.transform = 'translateX(' + eventTranslateValue + ')';
}

// Iterate to next image
function nextEvent() {
    eventNumber = (eventNumber + 1) % eventCarousel.children.length;
    showEvent(eventNumber);
}

// Auto-scroll every 5 seconds
if (eventCarousel) {
    setInterval(nextEvent, 5000);
}

// ########################################################
// TIMETABLE STATUS -----------------------------------------
let timeSheetId = '1_0ILezzUlULNSmJO53mp55MsyjyGIIqYqm0kYdG8NaE';
let timeSheetTitle = 'school-timetable';
// Sheet Range for data
let timeSheetRange = 'A1:B11';

// Uses gvis, Google Visualization API
let timeUrl = ('https://docs.google.com/spreadsheets/d/' + timeSheetId + '/gviz/tq?sheet=' + timeSheetTitle + '&range=' + timeSheetRange);

fetch(timeUrl)
.then(res => res.text())
.then(rep => {
    const timeData = JSON.parse(rep.substr(47).slice(0,-2));

    let timeLength = timeData.table.rows.length;

    // when timetable displayed
    if (periodTimeTableTitle&&timeTitle) {
        // reset titles to match sheet
        periodTimeTableTitle.innerHTML = timeData.table.rows[0].c[0].v;
        timeTitle.innerHTML = timeData.table.rows[0].c[1].v;

        // go through cell values
        for (let i = 1; i < timeLength; i++) {
            // period
            let newPeriod = document.createElement('div');
            newPeriod.id = ("period-timetable-"+i);
            newPeriod.className = "timetable-period-cell";
            periodTimetable.append(newPeriod);
            newPeriod.innerHTML = timeData.table.rows[i].c[0].v;
    
            // time
            let newTime = document.createElement('div');
            newTime.id = ("time-"+i);
            newTime.className = "timetable-time-cell";
            time.append(newTime);
            newTime.innerHTML = timeData.table.rows[i].c[1].v;
        }

        return true;
    } 
})

// ########################################################
// LIBRARY STATUS -----------------------------------------
let libSheetId = '1d3rjJS5_7aUzdP-U1nIb5Q4sfoJgg6t5CNdaG5PxIwI';
let libSheetTitle = 'library-schedule';
// Sheet Range for data
let libSheetRange = 'A1:B11';

// Uses gvis, Google Visualization API
let libUrl = ('https://docs.google.com/spreadsheets/d/' + libSheetId + '/gviz/tq?sheet=' + libSheetTitle + '&range=' + libSheetRange);

fetch(libUrl)
.then(res => res.text())
.then(rep => {
    const libData = JSON.parse(rep.substr(47).slice(0,-2));

    const length = libData.table.rows.length;

    if (periodTitle&&statusTitle) {
        periodTitle.innerHTML = libData.table.rows[0].c[0].v;
        statusTitle.innerHTML = libData.table.rows[0].c[1].v;

        for (var i = 1; i < length; i++) {
            let newPeriod = document.createElement('div');
            newPeriod.id = ("period-"+i);
            newPeriod.className = "lib-period-cell";
            period.append(newPeriod);
            newPeriod.innerHTML = libData.table.rows[i].c[0].v;
    
            let newStatus = document.createElement('div');
            newStatus.id = ("status-"+i);
            newStatus.className = "lib-status-cell";
            status.append(newStatus);
            newStatus.innerHTML = libData.table.rows[i].c[1].v;

            // change the colour of the status col based on the status
            if (libData.table.rows[i].c[1].v.toLowerCase() == "open") {
                newStatus.style.color = '#25edb8';
            } else if (libData.table.rows[i].c[1].v.toLowerCase() == "closed") {
                newStatus.style.color = "#F9959D";
            } else {
                newStatus.style.color = "#ebef72";
            }
        }

        /* https://stackoverflow.com/questions/72494154/a-listener-indicated-an-asynchronous-response-by-returning-true-but-the-messag
           I received an error I was unfamiliar with, and this is the simple solution
           Error: A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received */
        return true;
    } 
})

// ########################################################
// CLUB LIST ----------------------------------------------
// Turn num into the day of the week
function toDayOfTheWeek(dayNum) {
    switch (dayNum) {
        case 0: return "Monday";
        case 1: return "Monday";
        case 2: return "Tuesday"; 
        case 3: return "Wednesday"; 
        case 4: return "Thursday"; 
        case 5: return "Friday"; 
        case 6: return "Monday"; 
        default: return "Not a day";
    }
}

if (clubListContainer) {
    let date = new Date();

    // Generates a number from 0-6 for the day of week
    let dayOfTheWeek = date.getDay();

    let sheetId = '1TPNIy0NvCtkQa5ZbdYnjBxGrdnLFfi1SCkqPYMmdo9I';
    let sheetTitle = 'club-list';
    // Sheet Range for data
    let sheetRange = 'A1:C101';

    // Uses gvis, Google Visualization API
    let fullUrl = ('https://docs.google.com/spreadsheets/d/' + sheetId + '/gviz/tq?sheet=' + sheetTitle + '&range=' + sheetRange);

    fetch(fullUrl)
    .then(res => res.text())
    .then(rep => {

        const clubData = JSON.parse(rep.substr(47).slice(0,-2));

        const clubDataLength = clubData.table.rows.length;

        // match the clubs to the current day of the week
        for (let clubNum = 1; clubNum < clubDataLength; clubNum++) {
            if (clubData.table.rows[clubNum].c[0].v == toDayOfTheWeek(dayOfTheWeek)) {
                let newClub = document.createElement('div');
                newClub.className = "club";
                clubSlide.append(newClub);
                newClub.innerHTML = clubData.table.rows[clubNum].c[1].v + " | " + clubData.table.rows[clubNum].c[2].v;
            }
        }

        // Copy divs to create an infinite loop look
        let copyOfClubs = document.querySelector(".club-slide").cloneNode(true);
        clubListContainer.appendChild(copyOfClubs);

        return true;
    })
}
