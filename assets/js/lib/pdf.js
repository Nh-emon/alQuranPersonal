export function downloadPdf(element,fileName){
    let content = get('body')
    var opt = {
        margin:       1,
        filename:     `${fileName}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        includeStyles:true

      };
      html2pdf(content,opt)
}