export async function exportToPDF(content: string, filename: string) {
  // For now, we'll use a simple approach
  // In production, you'd use a library like jsPDF or html2pdf
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
            pre { white-space: pre-wrap; }
          </style>
        </head>
        <body>
          <pre>${content}</pre>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }
}

export function exportToMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.md`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToHTML(content: string, filename: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    pre { white-space: pre-wrap; background: #f5f5f5; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <pre>${content}</pre>
</body>
</html>
  `
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportToDOCX(content: string, filename: string) {
  // Simple DOCX export using HTML format that Word can open
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${filename}</title>
</head>
<body>
  <pre>${content}</pre>
</body>
</html>
  `
  const blob = new Blob([html], { type: 'application/msword' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.doc`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}



