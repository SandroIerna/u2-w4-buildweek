import PdfPrinter from "pdfmake";

export const getPdfReadableStream = (user, experiences) => {
  const fonts = {
    Roboto: {
      normal: "Helvetica",
    },
  };

  const printer = new PdfPrinter(fonts);

  const docDefinition = {
    content: [
      { text: "Name", style: "header" },
      `${user.name}`,
      { text: "Surname", style: "header" },
      `${user.surname}`,
      { text: "Email", style: "header" },
      `${user.email}`,
      { text: "Bio", style: "header" },
      `${user?.bio}`,
      { text: "Experiences", style: "header" },
      { text: "Company", style: "header" },
      `${experiences?.company}`,
      { text: "Description", style: "header" },
      `${experiences?.description}`,
    ],
    styles: {
      header: {
        fontSize: 15,
      },
    },
    defaultStyle: {
      fontSize: 12,
    },
  };

  const pdfReadableStream = printer.createPdfKitDocument(docDefinition);

  pdfReadableStream.end();

  return pdfReadableStream;
};
