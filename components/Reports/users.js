import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'

function userPDF(users) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs
  const reportTitle = [{
    text: 'Usuários',
    fontSize: 15,
    bold: true,
    margin: [15, 20, 0, 45]
  }];

  const data = users.map((user) => {
    return [
      { text: user.name, fontSize: 9, margin: [0, 2, 0, 2] },
      { text: user.email, fontSize: 9, margin: [0, 2, 0, 2] }
    ]
  })

  const details = [
    {
      table: {
        headerRows: 1,
        widhts: ['*', '*', '*', '*'],
        body: [
          [
            {
              text: 'Usuários', style: 'tableHeader', fontSize: 10
            },
            {
              text: 'Email', style: 'tableHeader', fontSize: 10
            }
          ],
          ...data
        ]
      },
      layout: 'headerLineOnly'
    }
  ];

  function Rodape(currentPage, pageCount) {
    return [
      {
        text: currentPage + ' / ' + pageCount,
        alignment: 'right',
        fontSize: 15,
        bold: true,
        margin: [0, 10, 20, 0]
      }
    ]
  }

  const docDefinitions = {
    pagesSize: 'A4',
    pageMargins: [15, 50, 15, 40],

    header: [reportTitle],
    content: [details],
    footer: [Rodape]
  }

  pdfMake.createPdf(docDefinitions).download();
}

export default userPDF