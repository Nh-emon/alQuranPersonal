import { initPageContent, openSection, updatePage } from "../main.js"
import { createNotification } from "./notification.js"

export function exportDb(){
    try{
        let currentJsonQuran = localStorage.Quran
        const blob = new Blob([currentJsonQuran],{type:'application/json'})
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        let currentTime = new Date()
        let timeOption = {day:'numeric',month:'long',year:'numeric'}
        let donwloadFileName = 'DB-'+currentTime.toLocaleDateString('en-US',timeOption) 
        link.download = donwloadFileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        createNotification(`new db exported,${donwloadFileName}`)
        createToast('success','db exported')
    }catch(e){
        createToast('warning','failed during export db')
        console.log(e)
    }
}

export function importJsonFile(e){
    const fileInput= e.target
    if(fileInput.files.length > 0){
        const uploadedFile = fileInput.files[0]
        const reader = new FileReader()
        reader.onload = function(event){
            const content = event.target.result
            try{
                try{
                    exportDb()
                }catch(e){createToast('info','db is empty')}
                localStorage.Quran = content
                createNotification(`new db imported,file : ${uploadedFile.name}`)
                createToast('success','db imported')
                initPageContent()
                openSection('main #section-surah')
            }catch(e){
                createToast('warning','check console')
                console.log(e)
            }
        }
        reader.readAsText(uploadedFile)
    }
}

export function clearDb(){
    try{
        exportDb()        
    }catch(e){}
    localStorage.clear()
    createToast('success','db clear successfully')
    initPageContent()
}
