function get(element) {
    return document.querySelector(element);
}

function getAll(element) {
    return document.querySelectorAll(element);
}

const themeBtnContainer = document.querySelector('#themeBtnContainer')
const lightBtn = document.querySelector('#lightMode')
const darkBtn = document.querySelector('#darkMode')
const root =document.querySelector(':root')
const chatBox = document.querySelector('#chatBox')
                                                             /* light mode */
                                                             

function loadSaveTheme(){
  try{
    let currentTheme = JSON.parse(localStorage.themeConfig).currentTheme
    if(currentTheme == 'light'){
      themeBtnContainer.classList.add('active')
      changeToLight()
    }else{
      themeBtnContainer.classList.remove('active')
      changeToDark()
    }
  }catch(e){
    console.log(e)
  }
}

loadSaveTheme()

function changeToLight(){
  let tempTheme;
   try{
      tempTheme = JSON.parse(localStorage.themeConfig)
   }catch(e){
    tempTheme = {
      currentTheme:''
    }
   }
   tempTheme.currentTheme = 'light'
   localStorage.themeConfig = JSON.stringify(tempTheme)

    root.style.setProperty('--bodyBg','rgb(233,233,233)')
    root.style.setProperty('--bodyFOnt', 'rgb(0, 0, 0)')
    root.style.setProperty('--bodyFOntLight','rgba(124, 121, 140, 0.773)')
    root.style.setProperty('--ContainerBg','rgb(236, 241, 230)')
    root.style.setProperty('--boxBg','rgba(245, 245, 245,.8)')
    root.style.setProperty('--boxBorder','rgba(74, 73, 80, 0)')/* no border in lightMode */
    root.style.setProperty('--boxShadow','rgba(0,0,0,.1)')  
    root.style.setProperty('--primaryColor','rgba(67, 20, 134, 0.986)')      
    root.style.setProperty('--scrollbarBgColor','transparent')
    root.style.setProperty('--scrollbarThumbColor','rgba(124, 121, 140, 0.773)')
}

function changeToDark(){
  let tempTheme;
  try{
     tempTheme = JSON.parse(localStorage.themeConfig)
  }catch(e){
   tempTheme = {
     currentTheme:''
   }
  }
  tempTheme.currentTheme = 'dark'
  localStorage.themeConfig = JSON.stringify(tempTheme)

    root.style.setProperty('--bodyBg','rgb(6, 2, 28)')
    root.style.setProperty('--bodyFOnt', 'rgb(252, 252, 252)')
    root.style.setProperty('--bodyFOntLight','rgba(177, 173, 195, 0.229)')
    root.style.setProperty('--ContainerBg','rgba(10, 9, 26, 0.943)')
    root.style.setProperty('--boxBg','rgba(68, 56, 115, 0.252)')
    root.style.setProperty('--boxBorder','rgba(74, 73, 80, 0.252)')
    root.style.setProperty('--boxShadow','rgba(58, 29, 106, 0)')/* no shadow in darkMOd */
    root.style.setProperty('--primaryColor','rgb(255,100,0)')          
    root.style.setProperty('--scrollbarBgColor','transparent')
    root.style.setProperty('--scrollbarThumbColor','rgba(249, 243, 254, 0.278)')
}


lightBtn.addEventListener('click',()=>{
    themeBtnContainer.classList.add('active')
    changeToLight()
})
// dark mode
darkBtn.addEventListener('click',()=>{
    themeBtnContainer.classList.remove('active')
    changeToDark()
})

document.addEventListener("keydown", function(event) {
  if (event.altKey && event.key === "t") {
    themeBtnContainer.classList.toggle('active')
    if(themeBtnContainer.classList.contains('active')){
        changeToLight()
    }else{
        changeToDark()
    }
  }

  if (event.altKey && event.key === "o") {
    chatBox.classList.toggle('active')
  }

});



// start toastSecion
let isPopUpexits = false

const toastData = {
    success:{icon:"fa-check",toastColor:"rgb(100,255,100)"},
    error:{icon:"fa-circle-xmark",toastColor:"rgb(220,20,60)"},
    warning:{icon:"fa-warning",toastColor:"rgb(255,100,0)"},
    info:{icon:"fa-info",toastColor:"rgb(0,0,255)"},
    clipboard:{icon:"fa-clipboard",toastColor:"rgb(255,255,255)"},    
}

const removeToast =(toast)=>{
    toast.style.display = 'none'
    isPopUpexits = false
}

function createToast (type,message) {
    const toastContainer = document.createElement('div')
    toastContainer.classList.add('toastNotification')
    document.body.appendChild(toastContainer)
    const toast = document.createElement('div')
    toast.classList.add('toast',type,'border-max','radius-small','shadow-mid')
    let icon = toastData[`${type}`].icon
    let toast_color = toastData[`${type}`].toastColor
    toast.innerHTML = ` 
    <header class='flex-between pad-min body-bg'>
    <span>Notification</span>
    <i  class="fa-solid fa-xmark-circle f16 f-right closeToast"></i>
    </header>
    <div class='flex gap-mid w-full pad-mid box-bg radius-small border-min'>
    <i class="fa-solid ${icon}" id="toastLogo"></i>
    <span class="toastMessage w-full">${message}</span>
    </div>
    `
toast.querySelector('#toastLogo').style.color = `${toast_color}`                        
toast.style.setProperty('--beforeColor',`${toast_color}`)
if(!isPopUpexits){
const toastNotification = document.querySelector('.toastNotification')
toastNotification.appendChild(toast)    
isPopUpexits = true;
}

document.querySelectorAll(".toast .closeToast").forEach(toastCloseBtn=>{
          toastCloseBtn.addEventListener('click',()=>{
                toastCloseBtn.parentNode.parentNode.style.display = 'none';
          })
// currently created toast
   setTimeout(()=>{
    removeToast(toast)
    // const toastNotification = document.querySelector('.toastNotification')
    // document.body.removeChild(toastNotification)
    
   },4000)          

})

}
// toast example
// anyBtn.addEventListener('click',()=>{
//     createToast('success',"form fill up successfully")
//     createToast('type',"message")
// })
// end toastExpale

// loading animtaion 
const loaderEl = document.querySelector('.loader')
if(loaderEl){
document.querySelector('.loader').innerHTML =
   `<div class="load one"></div>
    <div class="load two"></div>
    <div class="load three"></div>`    
}
// how to use it
// any element with class .loader
// control width,height,display 
// 1.display:none to remove
// 2. .loader is the parent and .load is the child so .loader size is :width:8rem;height: 3rem and .load size is width:1.7rem;height:1.7rem;;

 
 // ripple Effect
const ripple_buttons = document.querySelectorAll('.has_ripple')
ripple_buttons.forEach(eachBtn=>{
     eachBtn.addEventListener('click',(e)=>{
          // let get where we click in the page
          let clickX =e.clientX 
          let clickY =e.clientY
          let elementFromLeft =e.target.offsetLeft 
          let elementFromTop = e.target.offsetTop
          // set new element position from button
          let rippleX = clickX-elementFromLeft
          let rippleY = clickY-elementFromTop
          let ripple = document.createElement('span')
          ripple.classList.add('ripple')
          ripple.style.top = `${rippleY}px`
          ripple.style.left= `${rippleX}px`          
          eachBtn.appendChild(ripple)
          setTimeout(()=>{
               ripple.remove()
          },500)
     })
})
// ************************************************ end


// drop-down

const allDD = getAll('.dropDown')

allDD.forEach(eachDD=>{
    eachDD.querySelector('.selectField').addEventListener('click', () => {
        eachDD.querySelector('.fa-chevron-down').classList.toggle('active');
        eachDD.querySelector('.dd-options').classList.toggle('active');
    
        eachDD.querySelectorAll('.dd-options .dd-option').forEach(eachOption => {
          eachOption.classList.remove('active')
            eachOption.addEventListener('click', () => {
                eachOption.classList.add('active')
                eachDD.querySelector('.optionText').innerText = eachOption.innerText;
                eachDD.querySelector('.dd-options').classList.remove('active');
                eachDD.querySelector('.fa-chevron-down').classList.remove('active');    
            });
        });
    
        // Prevent the click event from propagating further and immediately hiding the options again
        event.stopPropagation();
    });
    
})    



// Hide the options when clicking anywhere outside the #options div
document.addEventListener('click', (event) => {

    document.querySelectorAll('.dropDown').forEach(eachDD=>{
        let options = eachDD.querySelector('.dd-options')

        if (!options.contains(event.target)) {
            options.classList.remove('active');
            eachDD.querySelector('.fa-chevron-down').classList.remove('active');
        }    
    })


});

function getTimeDifference(time) {
    const currentTime = new Date();
    const targetTime = new Date(time);
  
    const timeDifference = currentTime - targetTime;
    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;
    const secondsInWeek = 604800;
    const secondsInMonth = 2592000;
    const secondsInYear = 31536000;
  
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(timeDifference / 1000 / secondsInMinute);
    const hoursDifference = Math.floor(timeDifference / 1000 / secondsInHour);
    const daysDifference = Math.floor(timeDifference / 1000 / secondsInDay);
    const weeksDifference = Math.floor(timeDifference / 1000 / secondsInWeek);
    const monthsDifference = Math.floor(timeDifference / 1000 / secondsInMonth);
    const yearsDifference = Math.floor(timeDifference / 1000 / secondsInYear);
  
    if (yearsDifference > 0) {
      return `${yearsDifference} year${yearsDifference > 1 ? 's' : ''} ago`;
    } else if (monthsDifference > 0) {
      return `${monthsDifference} month${monthsDifference > 1 ? 's' : ''} ago`;
    } else if (weeksDifference > 0) {
      return `${weeksDifference} week${weeksDifference > 1 ? 's' : ''} ago`;
    } else if (daysDifference > 0) {
      return `${daysDifference} day${daysDifference > 1 ? 's' : ''} ago`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} hour${hoursDifference > 1 ? 's' : ''} ago`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} minute${minutesDifference > 1 ? 's' : ''} ago`;
    } else {
      return `${secondsDifference} second${secondsDifference > 1 ? 's' : ''} ago`;
    }
  }
  // Example usage:
//   const timeParameter = "2024-02-29T07:14:00Z"; // Replace with the desired time
//   const result = getTimeDifference(timeParameter);
//   console.log(result);
//   