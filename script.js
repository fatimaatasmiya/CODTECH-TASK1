"use strict";

const API = "45763fec024ac8e4844dd32a3decd4e2";
// const API = "70864ec18ed9001f8feda46082112eeb";

const dayElement = document.querySelector('.default_day');
const dateElement = document.querySelector('.default_date');
const btnElement = document.querySelector('.btn_search');
const inputElement = document.querySelector('.input_field');
const dayInfo = document.querySelector('.day_info');
const iconsConatiner = document.querySelector('.icons');
const listcontentElement = document.querySelector('.list_content ul');

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
//================= diaplay day
const day = new Date();
const dayName = days[day.getDay()];
// console.log(dayName);
dayElement.textContent = dayName

// ===============display date
let month = day.toLocaleString("default",{month: "long"});
let date = day.getDate();
let year = day.getFullYear();
// console.log(month,date,year);
dateElement.textContent = date + " " + month + " " + year;

btnElement.addEventListener('click',(e)=>{
   e.preventDefault();

   if(inputElement.value !== ""){
    const Search = inputElement.value;
    inputElement.value = "";
    findLocation(Search);
   
   }else{
    console.log("Please Enter the Country or City Name")
   }
})
async function findLocation(name){
    iconsConatiner.innerHTML= "";
    dayInfo.innerHTML="";
    listcontentElement.innerHTML = "";
 try {
     const API_url = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=${API}`
    //  console.log(API_url);
    const data = await fetch(API_url);
    // console.log(data);
    const result = await data.json();
    console.log(result);

    if(result.cod !== "404"){
        // image content
        const imgContent = displayImgContent(result);
        
        // display rightside content
        const rContent = rightContent(result);

        // forecast function
        displayForecast(result.coord.lat , result.coord.lon);

         setTimeout(()=>{
            iconsConatiner.insertAdjacentHTML("afterbegin",imgContent);
            iconsConatiner.classList.add("fadeIn");
            dayInfo.insertAdjacentHTML("afterbegin",rContent);
         },1500)



        // iconsConatiner.insertAdjacentHTML("afterbegin",imgContent);
        // dayInfo.insertAdjacentHTML("afterbegin",rContent);
    }else{
       const message = `<h2 class="weather_temp">${result.cod}°C</h2>
        <h3 class="cloudtxt">${result.message}</h3>`;
        iconsConatiner.insertAdjacentHTML("afterbegin",message);
    }
    
  }  catch (error) {}
}
function displayImgContent(data){
   return `<img src=" https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" alt="">
     <h2 class="weather_temp">${Math.round(data.main.temp - 275.15)}°C</h2>
     <h3 class="cloudtxt">${data.weather[0].description}</h3>`;
}

function rightContent(result){
    return `<div class="content">
                        <p class="title">NAME</p>
                        <span class="value">${result.name}</span>
                    </div>

                    <div class="content">
                        <p class="title">TEMP</p>
                        <span class="value">${Math.round(result.main.temp - 275.15)}°C</span>
                    </div>

                    <div class="content">
                        <p class="title">HUMIDITY</p>
                        <span class="value">${result.main.humidity}%</span>
                    </div>

                    <div class="content">
                        <p class="title">WIND SPEED</p>
                        <span class="value">${result.wind.speed} km/h</span>
                    </div>`;
}

async function displayForecast(lat,long){
  try{
    const foreCast_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${API}`;
    const data = await fetch(foreCast_API);
    const result = await data.json();
    // console.log(result);

   const forecastDays = [];
   
    const daysForecast = result.list.filter((forecast)=>{
      const forecastDate = new Date(forecast.dt_txt).getDate();
      if(!forecastDays.includes(forecastDate)){
         return forecastDays.push(forecastDate);
     }
});
    console.log(daysForecast);
  
    daysForecast.forEach((content,idx)=>{
        
        if(idx <= 3){
            listcontentElement.insertAdjacentHTML("afterbegin",forecast(content));
        }
    });
}catch(error){};
}


function forecast(frcontent){

   const day = new Date(frcontent.dt_txt);
   const dayName = days[day.getDay()];
   const splitDay = dayName.split("",3);
   const joinDay = splitDay.join("");
//    console.log(splitDay);
//    console.log(dayName);

    return  `<li>
            <img src=" https://openweathermap.org/img/wn/${frcontent.weather[0].icon}@2x.png" >
           <span>${joinDay}</span>
           <span class="day_temp">${Math.round(frcontent.main.temp - 275.15)}°C</span>
          </li>`;
}