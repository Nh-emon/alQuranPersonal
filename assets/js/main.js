import { exportDb, importJsonFile,clearDb } from "./lib/dbImportExport.js"
import { insertSurahIntoDropDown,showSurah,currentSurahId,changeSurahLoadedValue} from "./lib/handleContentLoad.js"
import { updateNotificationNumber,insertNotification,isNotificationLoaded} from "./lib/notification.js";
import { handleUpdateSurah } from "./lib/updateSurah.js"
import { handleCategoryList } from "./lib/handleCategory.js"
import { currentWordTableSurahId,showWordTable,isWordTableLoadedYet } from "./lib/wordTable.js";
import { handleAddCategory } from "./lib/handleCategory.js";
import { handleAddSurah } from "./lib/addSurah.js";
import { currentNoteCategory,insertNote,isNoteLoadedYet} from "./lib/note.js"
import { downloadPdf } from "./lib/pdf.js";

function get(element){ return document.querySelector(element)}
function getAll(element){ return document.querySelectorAll(element)}
function elementOnClick(element,func){
    element.addEventListener('click',(e)=>func(e))
}
// all page element
const menuBtn     =  get('#navMenuBtn'),
homeBtn           =  get('nav #homeBtn'),
leftSideMenu      =  get('#leftSide'),
leftSideHideBtn   =  get('#leftSideHideBtn'),
rightSideHideBtn  =  get('main #section-surah #surah-rightside #rightSideHideBtn'),
sectionSurah      =  get('main #section-surah'),
rightSideMenuBtn  =  get('main #section-surah #surah-main header #rightSideMenuBtn'),
allLeftSideBtn    =  getAll('#leftSide #Buttons button'),
allSections       =  getAll('main section'),
exportBtn         =  get('main #section-import-export #exportBtn'),
importBtn         =  get('main #section-import-export #importBtn'),
fileInput         =  get('main #section-import-export #fileInput'),
notificationBtn   =  get('nav #notification-icon'),
notificationLoadBtn= get('main #section-notification footer #loadNtfBtn'),
ayatLoadBtn       =  get('main #section-surah #surah-main #loadMoreAyatBtn'),
noteLoadBtn       =  get(('main #section-note footer #noteLoadBtn')),
clearDbBtn        =  get('main #section-import-export #clearDbBtn'),
wordLoadBtn       =  get('main #section-word-table footer #wordLoadBtn'),
addNoteBtn        =  get('main #section-surah #surah-rightside #noteContainer #addNoteBtn'),
closeNtfBtn       =  get('#section-notification #closeNtfBtn'),
readModeBtn       =  get('main #section-surah #readModeBtn'),
exitModeBtn       =  get('body #exitReadModeBtn'),
surahDownloadBtn  =  get('main #section-surah #surahDownloadBtn'),
ayats             =  get('main #section-surah #surah-main #ayats'),
navHideBtn        =  get('nav #hideNavBtn'),
navShowBtn        =  get('nav #showNavBtn'),
navSettingBtn     =  get('nav #navSettingBtn'),
navWordBtn        =  get('nav #navWordBtn'),
navNoteBtn        =  get('nav #navNoteBtn')
// other variable


elementOnClick(navSettingBtn,()=>{
    openSection('main #section-import-export')
})
elementOnClick(navWordBtn,()=>{
    navHideBtn.click()
    if(!isWordTableLoadedYet){showWordTable()}
    openSection('main #section-word-table')
})
elementOnClick(navNoteBtn,()=>{
    navHideBtn.click()
    if(!isNoteLoadedYet){
        insertNote()
    }
    openSection('main #section-note')
})




elementOnClick(navHideBtn,()=>{
    navShowBtn.classList.remove('dis-hide')
    navHideBtn.classList.add('dis-hide')
    get('nav').classList.add('hide')
})

elementOnClick(navShowBtn,()=>{
    navShowBtn.classList.add('dis-hide')
    navHideBtn.classList.remove('dis-hide')
    get('nav').classList.remove('hide')
})

// handle layout visibility
elementOnClick(menuBtn,()=>{leftSideMenu.classList.toggle('show')})
elementOnClick(leftSideHideBtn,()=>{leftSideMenu.classList.remove('show')})
elementOnClick(rightSideMenuBtn,()=>{sectionSurah.classList.toggle('hideRight')})
elementOnClick(rightSideHideBtn,()=>{sectionSurah.classList.add('hideRight')})


// handle section opening
export function openSection(section,removeLoader){
    allSections.forEach(eachSection=>{
        if(!eachSection.classList.contains('dis-hide')){
            eachSection.classList.add('dis-hide')
        }
    })
    if(removeLoader){
        setTimeout(() => {
            get('main #loaderContainer .loader').classList.remove('active')     
            get('main #loaderContainer').classList.add('dis-hide')     
            document.querySelector(section).classList.remove('dis-hide')                
        }, 2000);
    }else{
        document.querySelector(section).classList.remove('dis-hide')
    }
}

allLeftSideBtn.forEach(eachBtn=>{
    eachBtn.addEventListener('click',()=>{
        allLeftSideBtn.forEach(each_Btn=>each_Btn.classList.remove('active'))
        eachBtn.classList.add('active')
        if(eachBtn.getAttribute('id')==='updateSurah'){
            get('main #section-add-surah .dropDown').classList.remove('dis-hide')
            get('main #section-add-surah .sectionTitle').innerText = 'update surah'
            get('main #section-add-surah #updateBtn').classList.remove('dis-hide')
            get('main #section-add-surah #submitBtn').classList.add('dis-hide')
            get('main #section-add-surah #surahDeleteBtn').classList.remove('dis-hide')

        }
        else if(eachBtn.getAttribute('id')==='addSurah'){
            get('main #section-add-surah .dropDown').classList.add('dis-hide')
            get('main #section-add-surah .sectionTitle').innerText = 'add surah'
            get('main #section-add-surah #updateBtn').classList.add('dis-hide')
            get('main #section-add-surah #submitBtn').classList.remove('dis-hide')
            get('main #section-add-surah #surahDeleteBtn').classList.add('dis-hide')
        }
        else if(eachBtn.getAttribute('id')==='showNote'){
            if(!isNoteLoadedYet){
                insertNote()
            }
        }
        else if(eachBtn.getAttribute('id') === 'wordTable'){
            if(!isWordTableLoadedYet){showWordTable()}
        }
        openSection(`main #${eachBtn.getAttribute('data-handleSection')}`)
        setTimeout(()=>{
            leftSideMenu.classList.remove('show')
        },1000)    
    })
})

elementOnClick(homeBtn,()=>{
   allLeftSideBtn.forEach(eachBtn=>{
    if(eachBtn.classList.contains('active')){eachBtn.classList.remove('active')}
})
    if(sectionSurah.classList.contains('dis-hide')){
        get('main #loaderContainer').classList.remove('dis-hide')        
        get('main #loaderContainer .loader').classList.add('active')        
            openSection('main #section-surah',true)    
    }
})

elementOnClick(notificationBtn,()=>{
    openSection('main #section-notification')
    if(!isNotificationLoaded){
        insertNotification()
    }
})

elementOnClick(closeNtfBtn,()=>openSection('main #section-surah'))
 
elementOnClick(readModeBtn,()=>{
    get('nav').classList.add('dis-hide')
    sectionSurah.classList.add('hideRight')
    exitModeBtn.classList.remove('dis-hide')
    get('main #section-surah #surah-main header').classList.add('dis-hide')
})

elementOnClick(exitModeBtn,()=>{
    get('nav').classList.remove('dis-hide')
    sectionSurah.classList.remove('hideRight')
    exitModeBtn.classList.add('dis-hide')
    get('main #section-surah #surah-main header').classList.remove('dis-hide')
})


elementOnClick(surahDownloadBtn,()=>{window.print()})


export function initPageContent(){
    if(!localStorage.Quran){
        createToast('info','no surah exist,try to import')
    }else{
        updatePage()
        showSurah()
        handleAddCategory()
        handleAddSurah()   
    }
}
window.addEventListener('load',()=>{
    setTimeout(()=>{
        document.querySelector('main #section-loadedScreen').classList.remove('hasAnimation')
        document.querySelector('main #section-loadedScreen').classList.add('dis-hide')
        initPageContent()
        get('nav').classList.remove('dis-hide')
        document.querySelector('main #section-surah').classList.remove('dis-hide')
    },1500)
})



export function updatePage(){
    insertSurahIntoDropDown()
    handleCategoryList()
    handleUpdateSurah()
}



// handle import export buton event
elementOnClick(exportBtn,()=>exportDb())
elementOnClick(importBtn,()=>fileInput.click())
get('main #section-import-export #fileInput').addEventListener('change',(e)=>{importJsonFile(e)})
elementOnClick(clearDbBtn,()=>clearDb())

// handle all load btn
elementOnClick(notificationLoadBtn,()=>insertNotification(true))
elementOnClick(ayatLoadBtn,()=>showSurah(currentSurahId,true))
elementOnClick(noteLoadBtn,()=>insertNote(currentNoteCategory,true))
elementOnClick(wordLoadBtn,()=>showWordTable(currentWordTableSurahId,true))

