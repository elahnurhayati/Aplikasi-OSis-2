/**
 * Export and Print Utilities for OSIS Madrasah Al-Achdan (Westeros Edition)
 */

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Downloads a pristine Word Document (.doc) compatible with Microsoft Word, LibreOffice, and Google Docs.
 */
export const downloadDocFile = (filename: string, htmlBody: string, documentTitle = 'Dokumen Resmi OSIS Madrasah Al-Achdan') => {
  const completeHtml = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${documentTitle}</title>
      <!--[if gte mso 9]>
      <xml>
      <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
      </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page WordSection1 {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 2.0cm 2.0cm 2.0cm 2.0cm;
          mso-header-margin: 1.0cm;
          mso-footer-margin: 1.0cm;
          mso-paper-source: 0;
        }
        div.WordSection1 {
          page: WordSection1;
        }
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 12pt;
          line-height: 1.5;
          color: #000000;
          background-color: #ffffff;
        }
        h1, h2, h3, h4 {
          font-family: 'Arial', sans-serif;
          margin-top: 6pt;
          margin-bottom: 6pt;
          text-align: center;
          color: #000;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10pt;
          margin-bottom: 12pt;
        }
        th, td {
          border: 1px solid #000000;
          padding: 5pt 7pt;
          text-align: left;
          font-size: 11pt;
        }
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .font-bold { font-weight: bold; }
        .border-none, .border-none td {
          border: none !important;
        }
      </style>
    </head>
    <body>
      <div class="WordSection1">
        ${htmlBody}
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', completeHtml], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads a standalone printable HTML/PDF file with standard A4 formatting.
 */
export const downloadStandaloneHtml = (filename: string, htmlBody: string, documentTitle = 'Dokumen Resmi OSIS Madrasah Al-Achdan') => {
  const completeHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 15mm 20mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11.5pt;
      line-height: 1.5;
      color: #000000;
      background: #ffffff;
      margin: 0 auto;
      padding: 20px;
      max-width: 210mm;
    }
    @media print {
      body {
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
    .print-bar {
      background: #1e293b;
      color: white;
      padding: 10px 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: sans-serif;
      font-size: 13px;
    }
    .print-btn {
      background: #eab308;
      color: black;
      border: none;
      padding: 6px 16px;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <span>Dokumen Resmi Madrasah Al-Achdan • Klik Cetak atau tekan Ctrl+P untuk Simpan sebagai PDF</span>
    <button class="print-btn" onclick="window.print()">Cetak / Simpan PDF</button>
  </div>
  ${htmlBody}
</body>
</html>`;

  const blob = new Blob([completeHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * High-fidelity print engine: renders an isolated invisible iframe with pure white A4 print styles.
 * If iframe printing is prevented by browser sandbox, seamlessly falls back to inline printable element.
 */
export const printCleanHtml = (htmlContent: string, title = 'Dokumen OSIS Madrasah Al-Achdan') => {
  // Always update the dedicated printable container in index.html for direct window.print() fallback
  let printMount = document.getElementById('printable-paper');
  if (!printMount) {
    printMount = document.createElement('div');
    printMount.id = 'printable-paper';
    printMount.className = 'print-only-container hidden print:block';
    document.body.appendChild(printMount);
  }
  printMount.innerHTML = htmlContent;

  // Attempt using isolated iframe for clean background print
  const existingIframe = document.getElementById('clean-print-frame');
  if (existingIframe) {
    existingIframe.remove();
  }

  const iframe = document.createElement('iframe');
  iframe.id = 'clean-print-frame';
  iframe.style.position = 'fixed';
  iframe.style.top = '-10000px';
  iframe.style.left = '-10000px';
  iframe.style.width = '210mm';
  iframe.style.height = '297mm';
  iframe.style.border = 'none';

  document.body.appendChild(iframe);

  try {
    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
          <meta charset="utf-8">
          <title>${title}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 15mm 20mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: 'Times New Roman', Times, serif;
              font-size: 11.5pt;
              line-height: 1.5;
              color: #000000;
              background: #ffffff;
              margin: 0;
              padding: 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 8pt 0;
            }
            th, td {
              padding: 4pt 6pt;
              font-size: 10.5pt;
              vertical-align: top;
            }
            .table-bordered th, .table-bordered td {
              border: 1px solid #000000;
            }
            .table-bordered th {
              background-color: #f0f0f0;
              font-weight: bold;
            }
            .header-kop {
              border-bottom: 3px double #000000;
              padding-bottom: 8pt;
              margin-bottom: 14pt;
              text-align: center;
            }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .underline { text-decoration: underline; }
          </style>
        </head>
        <body>
          ${htmlContent}
        </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch {
          // Fallback to window.print if iframe print is restricted
          window.print();
        }
      }, 350);
      return;
    }
  } catch {
    // Fallback
  }

  // Fallback to window.print directly
  window.print();
};

export const downloadCsvFile = (filename: string, headers: string[], rows: (string | number)[][]) => {
  const processCell = (val: string | number) => {
    let str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      str = `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.map(processCell).join(','),
    ...rows.map(row => row.map(processCell).join(','))
  ].join('\r\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const printDocument = () => {
  window.print();
};
