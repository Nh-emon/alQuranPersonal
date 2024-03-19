import { createNotification } from "./notification.js";

const allInputs = getAll('main #section-add-surah .text-input'),
submitBtn = get('main #section-add-surah #submitBtn'),
surahIdInput = get('main #section-add-surah #surahIdInput'),
surahNameInput = get('main #section-add-surah #surahNameInput'),
surahMeaningInput = get('main #section-add-surah #surahMeaningInput'),
surahVerseInput = get('main #section-add-surah #surahVerseInput'),
arInput = get('main #section-add-surah #arInput'),
arEnInput = get('main #section-add-surah #arEnInput'),
enInput = get('main #section-add-surah #enInput'),
bnInput = get('main #section-add-surah #bnInput'),
surahWordInput = get('main #section-add-surah #surahWordInput'),
surahDescriptionInput = get('main #section-add-surah #surahDescription'),
allAyatTextInput = [arInput,arEnInput,enInput,bnInput]

import { handleInputValueExistence,handleAyatTextLength,handleAllWordLength } from "./addSurah.js";

export function handleUpdateSurah(){
    getAll('main #section-add-surah .dropDown .dd-options .dd-option').forEach(eachSurah=>{
        eachSurah.addEventListener('click',()=>{
            try{
                let tempQuran = JSON.parse(localStorage.Quran)
                let allSurah = tempQuran.allSurah
                let selectedSurah;
                allSurah.forEach(EachSurah=>{
                   if(EachSurah.surah_id == eachSurah.getAttribute('data-surahId')){
                       selectedSurah = EachSurah
                   }
                })
                addSurahDataIntoForm(selectedSurah)                
               }catch(e){
                   createToast('warning','something went wrong when update surah')
                   console.log(e)
               }           
        })    
    })
    get('main #section-add-surah #updateBtn').addEventListener('click',()=>{
        let allInputHasValue = handleInputValueExistence()
        if(allInputHasValue){
            let allAyatTextLengthIsOk = handleAyatTextLength() 
            if(allAyatTextLengthIsOk){
                let allWordLengthIsOk = handleAllWordLength()
                if(allWordLengthIsOk){
                    updateSurah()
                }
            }
        }    
    })
}

function addSurahDataIntoForm(surah){
    let allParameterName = ['surah_id','surah_name','surah_meaning','surah_verse','surah_description','surah_words','surah_ayat_ar','surah_ayat_arEn','surah_ayat_en','surah_ayat_bn']
    let allParameterRealterInput = [surahIdInput,surahNameInput,surahMeaningInput,surahVerseInput,surahDescriptionInput,surahWordInput,arInput,arEnInput,enInput,bnInput]
    allParameterName.forEach((eachParameter,i)=>{
     allParameterRealterInput[i].value = (surah[allParameterName[i]])
    })

}

function updateSurah(){
    let allParameterName = ['surah_id','surah_name','surah_meaning','surah_verse','surah_description','surah_words','surah_ayat_ar','surah_ayat_arEn','surah_ayat_en','surah_ayat_bn']
    let allParameterRealterInput = [surahIdInput,surahNameInput,surahMeaningInput,surahVerseInput,surahDescriptionInput,surahWordInput,arInput,arEnInput,enInput,bnInput]
    try{
        let tempQuran = JSON.parse(localStorage.Quran)
        let tempAllSurah = tempQuran.allSurah
        let selectedSurah;
        let selectedSurahIndex;
        tempAllSurah.forEach((eachSurah,i)=>{
           if(eachSurah.surah_id == allParameterRealterInput[0].value){
               selectedSurah = eachSurah
               selectedSurahIndex = i
           }
        }) 
        allParameterName.forEach((eachParameter,i)=>{
            tempAllSurah[selectedSurahIndex][allParameterName[i]] = allParameterRealterInput[i].value
        })
        tempQuran.allSurah = tempAllSurah
        localStorage.Quran = JSON.stringify(tempQuran)
        createToast('success',`${selectedSurah.surah_id}:${selectedSurah.surah_name} updated successfully`)
        createNotification(`${selectedSurah.surah_id}:${selectedSurah.surah_name} updated successfully`)
        removeValueFromInput()
    }catch(e){
        createToast('error','error while update surah')
        console.log(e)
    }
}

export function removeValueFromInput(){
    let allParameterRealterInput = [surahIdInput,surahNameInput,surahMeaningInput,surahVerseInput,surahDescriptionInput,surahWordInput,arInput,arEnInput,enInput,bnInput]
    allParameterRealterInput.forEach(eachInput=>eachInput.value = '')
}