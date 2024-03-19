import { showWordTable } from "./wordTable.js";
import { openSection } from "../main.js";
import { addNote } from "./note.js";

let surahLoadIndex = 0;
let surahPerLoad = 5;
export let currentSurahId;
let isSurahLoadedYet = false


export function changeSurahLoadedValue(){
  isSurahLoadedYet = false
}

export function insertSurahIntoDropDown(){
    const allSurahDDoptions = getAll('.surahDD .dd-options')
    let DDoptionsHtml = ''
    try{
        let allSurah = JSON.parse(localStorage.Quran).allSurah
        // console.log(allSurah)
       for(let i=0;i<allSurah.length;i++){
         let newList = `<li data-surahId='${allSurah[i].surah_id}' class='dd-option'><p>${allSurah[i].surah_id} . ${allSurah[i].surah_name}</p></li>`          
         DDoptionsHtml += newList
       }
       allSurahDDoptions.forEach(eachDD=>{
        eachDD.innerHTML = DDoptionsHtml
       })
       handleLeftSideSurahOption()
    }catch(e){
        console.log(e)
        setTimeout(()=>createToast('warning','no surah exist'),2000)
    }
}

function handleLeftSideSurahOption(){
    let leftSideMenu      =  get('#leftSide')
    let allSurahList = getAll('#leftSide .surahDD .dd-options .dd-option')
    allSurahList.forEach(eachList=>{
        eachList.addEventListener('click',()=>{             
             isSurahLoadedYet = false
              surahLoadIndex = 0
              showSurah(eachList.getAttribute('data-surahId'))
              setTimeout(()=>leftSideMenu.classList.remove('show'),500)
        })
    })
}



export function showSurah(surahId,load){
    isSurahLoadedYet = true
    currentSurahId = surahId
    const ayatContainer = get('main #section-surah #ayats')
    if(!load){
        ayatContainer.innerHTML = ''
    }
    try{
        let allSurah = JSON.parse(localStorage.Quran).allSurah
        let firstSurah = allSurah[0];
        let requestSurah;
        allSurah.forEach(eachSurah=>{
            if(eachSurah.surah_id === surahId){
                requestSurah = eachSurah
            }
        })
        let selectedSurah = surahId ? requestSurah : firstSurah
        let allArAyat = selectedSurah.surah_ayat_ar.split('/')      .slice(surahLoadIndex,surahLoadIndex+surahPerLoad)
        let allArEnAyat = selectedSurah.surah_ayat_arEn.split('/')  .slice(surahLoadIndex,surahLoadIndex+surahPerLoad)
        let allEnAyat = selectedSurah.surah_ayat_en.split('/')      .slice(surahLoadIndex,surahLoadIndex+surahPerLoad)
        let allBnAyat = selectedSurah.surah_ayat_bn.split('/')      .slice(surahLoadIndex,surahLoadIndex+surahPerLoad)

         get('main #section-surah #surah-main #ayatLoadedNumber').innerText = `( ${surahLoadIndex+surahPerLoad}:${selectedSurah.surah_ayat_ar.split('/').length} )`

        surahLoadIndex += surahPerLoad

        if(surahLoadIndex > selectedSurah.surah_ayat_ar.split('/').length){
            get('main #section-surah #surah-main #loadMoreAyatBtn').classList.add('dis-hide')
            get('main #section-surah #surah-main #ayatLoadedNumber').innerText = `( ${selectedSurah.surah_ayat_ar.split('/').length}:${selectedSurah.surah_ayat_ar.split('/').length} )`
        }

        allArAyat.forEach((eachLine,i)=>{
            let newAyatHtml = `
            <div class="each-ayat shadow-mid border-min radius-small" data-currentVerse='${i}'>
            <i class="fa-solid fa-bookmark i-rec round mid box-bg space-x-mid"></i>
            <div class="ayat-texts">
                <li class="arabicText t-center font-light f14">${allArAyat[i]}</li>
                <li class="arabicEnText">${i+1} . ${allArEnAyat[i]}</li>
                <li class="englishText">${allEnAyat[i]}</li>
                <li class="banglaText font-light">${allBnAyat[i]}</li>
             </div>
           </div>
            `
            ayatContainer.innerHTML += newAyatHtml
        })
        handleBookMark(selectedSurah)
        handleLanugaeHideMode()
        handleRightSide(selectedSurah)
        handleWordTableBtn()
    }catch(e){
        console.log(e)
        createToast('error','something went wrong..')
    }
}

function handleRightSide(targetSurah){
    // document.querySelector('main #section-surah #surah-rightside #currentSurahName').innerText = ' surah : '+targetSurah.surah_name
    document.querySelector('main #section-surah #surah-rightside #surahTableContainer table').innerHTML = ''
    document.querySelector('main #section-surah #surah-rightside #surahTableContainer table').innerHTML = 
    `
    <caption class="f14 b7 space-y-mid">${targetSurah.surah_name}</caption>
    <thead>
    <tr>
        <th>Parameter</td>
        <th>Details</td>    
    </tr>
</thead>
<tbody>
    <tr>
        <td>surah</td>
        <td>${targetSurah.surah_name}</td>    
    </tr>
    <tr>
        <td>meaning</td>
        <td>${targetSurah.surah_meaning}</td>    
    </tr>
    <tr>
        <td>ayat</td>
        <td>${targetSurah.surah_verse}</td>    
    </tr>
    <tr>
        <td>type</td>
        <td>...</td>    
    </tr>
    <tr>
        <td>word table</td>
        <td><button class="btn mid secondary-bg" id="showWordTableBtn" data-surahId='${targetSurah.surah_id}'>show</button></td>    
    </tr>    
</tbody>
    `   
// handleWordTableBtn()
let descriptionArr = targetSurah.surah_description.split('/')
const surahDesEl =  document.querySelector('main #section-surah #surah-rightside #surahDesContainer #desText')
surahDesEl.innerHTML = ''
descriptionArr.forEach(eachDes=>{
    let newDesHtml = `<li class="font pad-mid space-y-min shadow-mid border-min radius-small box-bg">${eachDes}</li>
    `
    surahDesEl.innerHTML += newDesHtml
})

}

// handle bookmark
function handleBookMark(targetSurah){
    let allEachAyatBookMarkBtn = document.querySelectorAll('main #section-surah #surah-main #ayats .each-ayat i')
    allEachAyatBookMarkBtn.forEach((eachBtn,verse)=>{
        eachBtn.addEventListener('click',()=>{
            get('main #section-surah').classList.remove('hideRight')      
            setTimeout(()=>{
                get('main #section-surah #surah-rightside #noteContainer').classList.remove('dis-hide')
                get('main #section-surah #surah-rightside #noteContainer #targetSurahId').value = targetSurah.surah_name               
                get('main #section-surah #surah-rightside #noteContainer #targetVerse').value = verse+1      
    handleAddNote(targetSurah.surah_id,verse)
              },1300)      
        })
    })    
}

// handleAddNote
function handleAddNote(surahId,verse){
    const addNoteBtn = document.querySelector('main #section-surah #surah-rightside #noteContainer #addNoteBtn')
    addNoteBtn.addEventListener('click',()=>{
        addNote(surahId,verse)
    })
}

function handleLanugaeHideMode(){
         const ArBtn  =  get('main #section-surah #surah-main header #arBtn'),
         ArEnBtn      =  get('main #section-surah #surah-main header #arEnBtn'),
         EnBtn        =  get('main #section-surah #surah-main header #enBtn'),
         BnBtn        =  get('main #section-surah #surah-main header #bnBtn')
    let allEachAyatTextList = getAll('main #section-surah #surah-main #ayats .each-ayat .ayat-texts')
    let allLanguageBtn = [ArBtn,ArEnBtn,EnBtn,BnBtn]
    allLanguageBtn.forEach((eachBtn,i)=>{
        eachBtn.addEventListener('click',()=>{
            allEachAyatTextList.forEach(eachAyatTextList=>{
                eachAyatTextList.querySelectorAll('li')[i].classList.toggle('dis-hide')
            })
        })        
    })
    }
    

export  function handleWordTableBtn(){
        const showBtn = document.querySelector('main #section-surah #surah-rightside #surahTableContainer table  #showWordTableBtn')
        showBtn.addEventListener('click',()=>{
            // console.log(showBtn.getAttribute('data-surahId'))
            get('main #section-surah').classList.add('hideRight')
            setTimeout(()=>{
                openSection('main #section-word-table')
            },1000)
            showWordTable(showBtn.getAttribute('data-surahId'))
        })
    }
    