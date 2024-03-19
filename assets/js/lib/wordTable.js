let currentWordLoadIndex = 0;
let wordPerLoad = 5;
export let currentWordTableSurahId;
export let isWordTableLoadedYet = false

export function showWordTable(surahId,load){
    isWordTableLoadedYet = true
    currentWordTableSurahId = surahId
    const wordTableTBody = document.querySelector('main #section-word-table #wordTableContainer table tbody')
    if(!load){
        wordTableTBody.innerHTML = ''
    }
    try{
        let allSurah = JSON.parse(localStorage.Quran).allSurah
        let selectedSurah;
        if(surahId){
            allSurah.forEach(eachSurah=>{
                if(eachSurah.surah_id === surahId){
                    selectedSurah = eachSurah
                }
            })       
        }else{
            selectedSurah = allSurah[0]
        }
        let wordTableTitle = document.querySelector('main #section-word-table #word-table-title')
        wordTableTitle.innerText = `word from surah : ${selectedSurah.surah_name}`
        let surahWordFirstSplit = selectedSurah.surah_words.split('**')
        let surahWordFirstSplitSlice = surahWordFirstSplit.slice(currentWordLoadIndex,currentWordLoadIndex+wordPerLoad)
        document.querySelector('main #section-word-table footer #loadedWordNumber').innerText = `( ${currentWordLoadIndex+wordPerLoad}:${surahWordFirstSplit.length} )`
        currentWordLoadIndex += wordPerLoad
        if(currentWordLoadIndex>surahWordFirstSplit.length){
            document.querySelector('main #section-word-table footer #loadedWordNumber').innerText = `( ${surahWordFirstSplit.length}:${surahWordFirstSplit.length} )`
            document.querySelector('main #section-word-table footer #wordLoadBtn').classList.add('dis-hide')
        }
        surahWordFirstSplitSlice.forEach(eachWord=>{
           let newWords = eachWord.split('/')
           wordTableTBody.innerHTML += `
           <tr>
           <td class='f14'>${newWords[0]}</td>
           <td>${newWords[1]}</td>    
           <td>${newWords[2]}</td>
           <td>${newWords[3]}</td>
           </tr>
           ` 
        })
    }catch(e){console.log(e)}
}


export function handleWordTableSurahOption(){
    let allSurahList = document.querySelectorAll('main #section-word-table .surahDD .dd-options .dd-option')
    allSurahList.forEach(eachList=>{
        eachList.addEventListener('click',()=>{
              currentWordLoadIndex = 0;
              document.querySelector('main #section-word-table footer #wordLoadBtn').classList.remove('dis-hide')
              showWordTable(`${eachList.getAttribute('data-surahId')}`)
              
        })
    })

}
