import { createNotification } from "./notification.js"
import { handleNoteCategory } from "./note.js"
import { handleWordTableSurahOption } from "./wordTable.js"
import { handleUpdateSurah } from "./updateSurah.js"

export function handleCategoryList(){
    const rightSideCategoryList =   get('main #section-surah #surah-rightside .dropDown #categoryList')
    const sectionCategoryList   =   get('main #section-add-category #allCategoryList')
    const showNoteCategoryList  =   get('main #section-note #categoryList')
    sectionCategoryList.innerHTML = ''
    rightSideCategoryList.innerHTML = ''
    showNoteCategoryList.innerHTML = ''
    try{
        let allCategory = JSON.parse(localStorage.Quran).Category
        allCategory.forEach(eachCategory=>{
            rightSideCategoryList.innerHTML += `<li class="dd-option"><p>${eachCategory}</p></li>`
            sectionCategoryList.innerHTML += `<li class="box-bg pad-min shadow-min border-min radius-small f1">${eachCategory}</li>`
            showNoteCategoryList.innerHTML += `<li class="dd-option"><p>${eachCategory}</p></li>`
        })
handleDeleteCategory()
handleNoteCategory()
handleWordTableSurahOption()
    }catch(e){
        createToast('warning',`check console`)
        console.log(e)
    }
}


function handleDeleteCategory(){
   let deleteCategoryBtn = get('main #section-add-category header #deleteCategoryBtn')
   let allCategoryListFromPage = getAll('main #section-add-category #allCategoryList li')
   allCategoryListFromPage.forEach(eachCategory=>{
    eachCategory.addEventListener('click',()=>{
        eachCategory.classList.toggle('deleteIt')
        let allSelectedLi = getAll('main #section-add-category #allCategoryList li.deleteIt')
        if(allSelectedLi.length>0){
        deleteCategoryBtn.classList.remove('disable')
    }else{
     deleteCategoryBtn.classList.add('disable')
    } 
    })
   })
   deleteCategoryBtn.addEventListener('click',()=>{
    let allSelectedLi = getAll('main #section-add-category #allCategoryList li.deleteIt')
    allSelectedLi.forEach(eachSelectedCategory=>{
        deleteCategory(eachSelectedCategory.innerText)
    })
   })
}

function deleteCategory(categoryName){
    try{
        let tempQuran = JSON.parse(localStorage.Quran)
        let tempCategory = tempQuran.Category
        let filterCategory = tempCategory.filter(eachCat=>eachCat != categoryName)
        tempQuran.Category = filterCategory
        localStorage.Quran = JSON.stringify(tempQuran)
        createNotification(`category:${categoryName} removed`)
        createToast('success',` category : ${categoryName} removed successfully`)
        handleCategoryList()
    }catch(e){
        createToast('warning','check console')
        console.log(e)
    }
}

const addCategoryBtn = get('main #section-add-category #categoryAddBtn')
const categoryInput = get('main #section-add-category #categoryInput')


export function handleAddCategory(){
    addCategoryBtn.addEventListener('click',()=>{
        if(categoryInput.value.trim(" ")){
            addCategory(categoryInput.value)
            categoryInput.value = ''
            handleCategoryList()
        }else{createToast('warning','input field is empty')}
    })
    
}


function addCategory(categoryName){
    try{
        let quranTemp = JSON.parse(localStorage.Quran)
        let tempCategory = quranTemp.Category 
        if(!tempCategory){tempCategory = []}
        let CategoryALreadyExist = false
        tempCategory.forEach(eachCategory=>{
            if(eachCategory === categoryName){
                CategoryALreadyExist = true
            }
        })
        if(CategoryALreadyExist){
            createToast('warning',`category : ${categoryName} already exist`)
        }else{
            tempCategory.push(categoryName)
            quranTemp.Category = tempCategory
            localStorage.Quran = JSON.stringify(quranTemp)
            createToast('success',`new category : ${categoryName} added`)
            createNotification(`new category : ${categoryName} added`)
        }
    }catch(e){
        createToast('error','check console')
        console.log(e)
    }
}
