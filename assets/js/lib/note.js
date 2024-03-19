import { createNotification } from "./notification.js";

let currentNoteLoadIndex = 0;
let notePerLoad = 10;
export let currentNoteCategory;
export let isNoteLoadedYet = false

export function insertNote(categoryName,load){
     if(!isNoteLoadedYet){
        get('main #section-note footer #noteLoadBtn').classList.remove('dis-hide')    
    }
isNoteLoadedYet = true
currentNoteCategory = categoryName;
const noteTableTBody = get('main #section-note #noteTable table tbody')

if(!load){
    noteTableTBody.innerHTML = ''
}

try{

    let note = JSON.parse(localStorage.Quran).note
    if(note.length>0){
        get('main #section-note #noteTitle').innerText = 'All Note'
    }else{
        get('main #section-note #noteTitle').innerText = 'no note found'
    }
    if(categoryName){
        // console.log(note)
        let filterNote = note.filter(eachNote=>eachNote.category == categoryName)
        // console.log(filterNote)
        if(filterNote.length>0){
            note = filterNote
            let noteTitleText = note.length ? categoryName+' related Notes' : 'no note found'
            get('main #section-note #noteTitle').innerText = noteTitleText        
        }else{
            currentNoteCategory = ''
            createToast('info',`no note by '${categoryName}' `)
            get('main #section-note #noteTitle').innerText = 'all note'        
        }
    }
    let sliceNote = note.slice(currentNoteLoadIndex,currentNoteLoadIndex+notePerLoad)
    get('main #section-note footer #noteLoadedNumber').innerText = `( ${currentNoteLoadIndex+notePerLoad}:${note.length} )`
    currentNoteLoadIndex += notePerLoad
    if(currentNoteLoadIndex > note.length){
       get('main #section-note footer #noteLoadBtn').classList.add('dis-hide')        
       get('main #section-note footer #noteLoadedNumber').innerText = `( ${note.length}:${note.length} )`
    }
    let allSurah = JSON.parse(localStorage.Quran).allSurah
    for(let i=0;i<sliceNote.length;i++){
        let newNoteSurahId = sliceNote[i].surah_id
        let newNoteVerse = sliceNote[i].verse_no
        let selectedSurah;
        allSurah.forEach(eachSurah=>{
            if(eachSurah.surah_id === newNoteSurahId){
                selectedSurah = eachSurah
            }
        })
        let newNoteSurahName = selectedSurah.surah_name
        let newNoteSurahAyat = selectedSurah.surah_ayat_en.split('/')[newNoteVerse]
        let newNoteShorForm = `${newNoteSurahId}:${newNoteVerse+1}`
        noteTableTBody.innerHTML += `        
        <tr data-surahId='${newNoteSurahId}' data-surahVerse='${newNoteVerse}'>
        <td>${newNoteSurahName}</td>
        <td>${newNoteVerse+1}</td>    
        <td>${sliceNote[i].category}</td>
        <td>${newNoteShorForm}</td>
        <td>${newNoteSurahAyat}</td>
    </tr>
        `
    }
handleDeleteNote()
handleNoteRowViewBtn()
}catch(e){
    console.log(e)
    createToast('error','something went wrong!')
}
}

function handleNoteRowViewBtn(){
    const viewBtn = get('main #section-note #noteViewBtn')
    viewBtn.addEventListener('click',()=>{
        get('main #section-note #noteTable table').classList.toggle('shortTable')
    })
}

function handleDeleteNote(){
    const deleteNoteBtn = get('main #section-note #deleteNoteBtn')
    const allRow = getAll('main #section-note table tbody tr')
    allRow.forEach(eachRow=>{
        eachRow.addEventListener('click',()=>{
            eachRow.classList.toggle('deleteIt')
            let allDeleteRow = getAll('main #section-note table tbody tr.deleteIt')
            // console.log(allDeleteRow.length)
            if(allDeleteRow.length>0){
                deleteNoteBtn.classList.remove('disable')
            }else{
                deleteNoteBtn.classList.add('disable')
            }            
        })
    })
    deleteNoteBtn.addEventListener('click',()=>{
        let allDeleteRow = getAll('main #section-note table tbody tr.deleteIt')
        allDeleteRow.forEach(eachRow=>{
            deleteNote(eachRow.getAttribute('data-surahId'),eachRow.getAttribute('data-surahVerse'))
            deleteNoteBtn.classList.add('disable')
            currentNoteLoadIndex = 0
            insertNote()
        })
    })
}

function deleteNote(surahId,verseNo){
    try{
         let tempQuran = JSON.parse(localStorage.Quran)
         let tempNote = tempQuran.note
         let tempNoteFilter =  tempNote.filter(eachNote=>!(eachNote.surah_id == surahId && eachNote.verse_no == verseNo))
         tempQuran.note = tempNoteFilter
         localStorage.Quran = JSON.stringify(tempQuran)
         createNotification(`sruah:${surahId} verse:${verseNo} removed from note`)
    }catch(e){
        createToast('warning','check console')
        console.log(e)
    }
}

export function handleNoteCategory(){
    let allCategoryList = getAll('main #section-note .dropDown .dd-options .dd-option')
    allCategoryList.forEach(eachCategory=>{
      eachCategory.addEventListener('click',()=>{
          isNoteLoadedYet = false
          currentNoteLoadIndex = 0
          insertNote(eachCategory.innerText)
      })
    })
}

export function addNote(surahId,verse){
    try{
        let targetCategory = document.querySelector('main #section-surah #surah-rightside #noteContainer .dropDown .dd-options .dd-option.active').innerText
        let tempQuran = JSON.parse(localStorage.Quran)
        let newNote = {
            surah_id:surahId,
            verse_no:verse,
            category:targetCategory
        }
        tempQuran.note.push(newNote)
        localStorage.Quran = JSON.stringify(tempQuran)
        createToast('success',`surah ${surahId}:${verse+1} verse added in note`)
        createNotification(`new note added,type:${targetCategory} verse:${surahId}-${verse+1}`)
        currentNoteLoadIndex = 0
        isNoteLoadedYet = false;
        insertNote()
        document.querySelector('main #section-surah #surah-rightside #noteContainer .dropDown .dd-options .dd-option').classList.remove('active')
    }catch(e){
        createToast('warning','please select category')
    }
}



