import { openSection, updatePage } from "../main.js"
import { insertSurahIntoDropDown, showSurah } from "./handleContentLoad.js"
import { createNotification } from "./notification.js"
import { removeValueFromInput } from "./updateSurah.js"

function get(item){return document.querySelector(item)}
function getAll(item){return document.querySelectorAll(item)}


const allInputs = getAll('main #section-add-surah .text-input')
const submitBtn = get('main #section-add-surah #submitBtn')

const surahIdInput = get('main #section-add-surah #surahIdInput'),
surahNameInput = get('main #section-add-surah #surahNameInput'),
surahMeaningInput = get('main #section-add-surah #surahMeaningInput'),
surahVerseInput = get('main #section-add-surah #surahVerseInput'),
arInput = get('main #section-add-surah #arInput'),
arEnInput = get('main #section-add-surah #arEnInput'),
enInput = get('main #section-add-surah #enInput'),
bnInput = get('main #section-add-surah #bnInput'),
surahWordInput = get('main #section-add-surah #surahWordInput'),
surahDescriptionInput = get('main #section-add-surah #surahDescription'),
surahDeleteBtn = get('main #section-add-surah #surahDeleteBtn')

const allAyatTextInput = [arInput,arEnInput,enInput,bnInput]

export function handleAyatTextLength(){
    let processResult = true
    allAyatTextInput.forEach(eachInput=>{
        if(eachInput.value.split('/').length !== allAyatTextInput[0].value.split('/').length){
            let arAyat = allAyatTextInput[0].value.split('/').length
            let arEnAyat = allAyatTextInput[1].value.split('/').length
            let enAyat = allAyatTextInput[2].value.split('/').length
            let bnAyat = allAyatTextInput[3].value.split('/').length
        createToast('error',`ayat length not match->ar(${arAyat}) arEn(${arEnAyat}) en(${enAyat}) bn(${bnAyat})`)
        processResult = false
        }
    })    
    return processResult;
}


export function handleAllWordLength(){
    let processResult = true
    let errorWordIdArray = []
    let surahWordInputValue = surahWordInput.value
    let surahWordInputFirstSplit = surahWordInputValue.split('**')
    surahWordInputFirstSplit.forEach((eachWordArray,id)=>{
        if(eachWordArray.split('/').length !== 4){
            errorWordIdArray.push(id)
        }
    })
    if(errorWordIdArray.length>0){
        processResult = false
        errorWordIdArray = errorWordIdArray.map(eachId=>eachId+1)
        createToast('warning',`position:(${errorWordIdArray}) has no 4 word`)
    }
    return processResult;
}


export function handleAddSurah(){
    submitBtn.addEventListener('click',()=>{
        let allInputHasValue = handleInputValueExistence()
        if(allInputHasValue){
            let allAyatTextLengthIsOk = handleAyatTextLength() 
            if(allAyatTextLengthIsOk){
                let allWordLengthIsOk = handleAllWordLength()
                if(allWordLengthIsOk){
                    addSurah()
                }
            }
        }
    })
    surahDeleteBtn.addEventListener('click',()=>{
        deleteSurah()
    })
}


function deleteSurah(){
    const currentSurahIdInput = get('main #section-add-surah #surahIdInput')
    try{
      let tempQuran = JSON.parse(localStorage.Quran)
      let tempAllSurah = tempQuran.allSurah
      let filterTempAllSurah = tempAllSurah.filter(eachSurah=>eachSurah.surah_id != currentSurahIdInput.value)
      tempQuran.allSurah = filterTempAllSurah
      localStorage.Quran = JSON.stringify(tempQuran)
      createNotification(`surah(id:${currentSurahIdInput.value}) removed`)
      createToast('success',`surah( id : ${currentSurahIdInput.value} ) removed`)
      removeValueFromInput()
      updatePage()
    }catch(e){
        createToast('error','failed while delete this surah')
    }
}




function addSurah(){
    let allParameterName = ['surah_id','surah_name','surah_meaning','surah_verse','surah_description','surah_words','surah_ayat_ar','surah_ayat_arEn','surah_ayat_en','surah_ayat_bn']
    let allParameterRealterInput = [surahIdInput,surahNameInput,surahMeaningInput,surahVerseInput,surahDescriptionInput,surahWordInput,arInput,arEnInput,enInput,bnInput]
    let newSurah = {}
    for(let i = 0;i<allParameterName.length;i++){
        newSurah[`${allParameterName[i]}`] = allParameterRealterInput[i].value
    }
    addSurahToDB(newSurah)
}


function addSurahToDB(surah){

    let tempJsonData = '{"allSurah":[],"note":[],"notification":[],category:[]}'

    let tempQuran;

try{
    tempQuran = JSON.parse(localStorage.Quran)
}catch(e){
    tempQuran = JSON.parse(tempJsonData);
}

tempQuran.allSurah.push(surah)
localStorage.Quran = JSON.stringify(tempQuran)
let newSurahName = surah.surah_name
let newSurahId = surah.surah_id
createToast('success',`surah (${newSurahName}) added successfully`)
createNotification(`new surah ${newSurahName} added`)
removeValueFromInput()
updatePage()
}


// handle notification



export function handleInputValueExistence(){
    let allInputValueExist=true;
    allInputs.forEach(eachInput=>{
        if(!eachInput.value){
            highLightEl(eachInput,'no value inserted','ph',2000)
            createToast('error','make sure all field are fulfil')
            allInputValueExist = false
        }
    })
    return allInputValueExist;
}




function highLightEl(element,msg,form,duration){
	element.classList.add('hightLight')
	if(form === 'ph'){
	let firstText = element.placeholder
	element.placeholder = msg
	setTimeout(()=>{
		element.classList.remove('hightLight')
		element.placeholder = firstText
	},duration)

}else{
	let firstText = element.value
	element.value = msg
	setTimeout(()=>{
		element.classList.remove('hightLight')
		element.value = firstText
	},duration)	
}
}

