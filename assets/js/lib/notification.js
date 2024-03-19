let currentNotificationLoadIndex = 0;
let NotificationItemPerLoad = 10;
export let isNotificationLoaded = false;

export function insertNotification(loadMore){
    const notificationTableBody = document.querySelector('main #section-notification #notificationTable table tbody')
    if(!loadMore){
        notificationTableBody.innerHTML = '' 
    }
    if(!isNotificationLoaded){
        currentNotificationLoadIndex = 0
        document.querySelector('main #section-notification footer #loadNtfBtn').classList.remove('dis-hide')
    }
    
  try{ 
       let allNotification = JSON.parse(localStorage.Quran).notification.reverse()
       let slicedNotification = allNotification.slice(currentNotificationLoadIndex,currentNotificationLoadIndex+NotificationItemPerLoad)
       currentNotificationLoadIndex += NotificationItemPerLoad
       if(currentNotificationLoadIndex>allNotification.length){
        document.querySelector('main #section-notification footer #loadNtfBtn').classList.add('dis-hide')
       }
        slicedNotification.forEach(eachNtf=>{
            let ntfState = eachNtf.ntf_state === 'seen' ? 'disable' : ''
            let styleMode = eachNtf.ntf_state ==='seen' ? 'font-light' : ''
            let timeDiff = getTimeDifference(eachNtf.ntf_time)
             let newNotificationHtml = `
             <tr>
             <td class='${styleMode}'>${timeDiff}</td>
             <td class='${styleMode}'>${eachNtf.ntf_msg}</td>    
             <td><button class="btn min primary-bg ${ntfState}" data-ntf_id='${eachNtf.ntf_id}'>read</button></td>
             </tr>
             `            
             notificationTableBody.innerHTML += newNotificationHtml
        })    
        isNotificationLoaded = true;
        HandleNotificationReadBtn()
        // handleLoadMoreNotification()
  }catch(e){
    console.log(e)
    createToast('warning','check console')
  }
}





export function updateNotificationNumber(){
    let notificationNumber= get('nav #notification-icon #notification-number')
    let ntfNumberFromDb = getUnseenNotificationNumber()
    if(ntfNumberFromDb>0){
        notificationNumber.classList.remove('dis-hide')
        notificationNumber.innerText = ntfNumberFromDb
    }else{
        notificationNumber.classList.add('dis-hide')
    }
}

function getUnseenNotificationNumber(){
    let unseenNotification = 0;
    try{
        let allNotification = JSON.parse(localStorage.Quran).notification.reverse()
        allNotification.forEach(eachNtf=>{
            if(eachNtf.ntf_state === 'unseen'){
                unseenNotification++
            }
        })
    }catch(e){
        console.log(e)
        createToast('warning','check console')
    }
    return unseenNotification
}

function HandleNotificationReadBtn(){
    let allNotificationReadBtn = getAll('main #section-notification #notificationTable table button')
    allNotificationReadBtn.forEach(eachBtn=>{
        eachBtn.addEventListener('click',()=>{
            markNotification(eachBtn.getAttribute('data-ntf_id'))
            eachBtn.parentNode.parentNode.classList.add('seen')
        })
    })
}

function markNotification(ntfId){
    try{
        let tempQuran = JSON.parse(localStorage.Quran)
        let allNotification = tempQuran.notification
         allNotification.forEach(eachNtf=>{
            if(eachNtf.ntf_id === parseInt(ntfId)){
                eachNtf.ntf_state = 'seen' 
            }
         })
        //  console.log(allNotification);
         tempQuran.notification = allNotification
         localStorage.Quran = JSON.stringify(tempQuran)
         updateNotificationNumber()
    }catch(e){
        console.log(e)
        createToast('warning','show console')
    }
}

export function createNotification(msg){
    let notificationTime = new Date()
    let notificationMsg = msg
    let notificationId = Math.floor(Math.random()*100000)
    let notificationState = 'unseen'
    let newNotification = {
      ntf_time:notificationTime,
      ntf_msg:notificationMsg,
      ntf_id:notificationId,
      ntf_state:notificationState
    }
    try{
       let tempQuran = JSON.parse(localStorage.Quran)
      tempQuran.notification.push(newNotification)
      localStorage.Quran = JSON.stringify(tempQuran)
      isNotificationLoaded = false
      updateNotificationNumber()
  }catch(e){
      console.log(e)
      createToast('warning','check console')
    }
}
