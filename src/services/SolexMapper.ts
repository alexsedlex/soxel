/* eslint-disable @typescript-eslint/ban-ts-comment */
import XLSX, { WorkBook } from "xlsx";

export function generateBloctelCSVFile(
  baseFile: File[],
  callback: (error: string, success: string) => void
): void {
  const reader = new FileReader();
  reader.onload = function(e) {
    if (e.target && e.target.result) {
      // @ts-ignore
      const data = new Uint8Array(e.target.result);
      const baseFileXLSX = XLSX.read(data, {
        type: "array",
      });
      const phoneNumbers = getPhoneNumbers(baseFileXLSX);
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Telephone;Identifiant\n";
      let i = 1;
      phoneNumbers.phonesNumber.forEach((phoneNumber) => {
        let zePhoneNumber = ("" + phoneNumber).trim();
        if (zePhoneNumber.length < 10) {
          zePhoneNumber = "0" + zePhoneNumber;
        }
        csvContent += zePhoneNumber.toString() + ";" + i.toString() + "\n";
        i++;
      });
      const fileName =
        baseFile[0].name
          .replace(".ods", "")
          .replace(".xls", "")
          .replace(".xlsx", "")
          .trim()
          .substring(0, 15) + "- DEMANDE BLOCTEL.csv";
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", fileName);
      document.body.appendChild(link); // Required for FF
      link.click();
      const ws = callback(
        "",
        "Le fichier contient " +
          phoneNumbers.lines +
          " lignes dont " +
          phoneNumbers.phonesNumber.length +
          " numéros de téléphones à à vérifier"
      );
    }
  };
  reader.readAsArrayBuffer(baseFile[0]);
}

export function generateBloctelOdsFile(
  baseFile: File[],
  callback: (error: string, success: string) => void
): void {
  const reader = new FileReader();
  reader.onload = function(e) {
    if (e.target && e.target.result) {
      // @ts-ignore
      const data = new Uint8Array(e.target.result);
      const baseFileXLSX = XLSX.read(data, {
        type: "array",
      });
      const phoneNumbers = getPhoneNumbers(baseFileXLSX);
      const blocTelFile = XLSX.utils.book_new();
      blocTelFile.SheetNames.push("Numéros à tester");
      const ws_data = [["Téléphone", "Identifant", "Réponse bloctel"]];
      let i = 1;
      phoneNumbers.phonesNumber.forEach((phoneNumber) => {
        ws_data.push([phoneNumber, i.toString(), ""]);
        i++;
      });
      const ws = XLSX.utils.aoa_to_sheet(ws_data);
      blocTelFile.Sheets["Numéros à tester"] = ws;

      // Write result
      const fileName =
        baseFile[0].name
          .replace(".ods", "")
          .replace(".xls", "")
          .replace(".xlsx", "")
          .trim()
          .substring(0, 15) + "- DEMANDE BLOCTEL.ods";
      try {
        XLSX.writeFile(blocTelFile, fileName);
      } catch (e) {
        callback(e, "");
      }
      callback(
        "",
        "Le fichier contient " +
          phoneNumbers.lines +
          " lignes dont " +
          phoneNumbers.phonesNumber.length +
          " numéros de téléphones à à vérifier"
      );
    }
  };
  reader.readAsArrayBuffer(baseFile[0]);
}

export function parseAndMapOds(
  baseFile: File[],
  bloctelAnswer: File[],
  callback: (error: string, success: string) => void
): void {
  const reader = new FileReader();
  reader.onload = function(e) {
    if (e.target && e.target.result) {
      // @ts-ignore
      const data = new Uint8Array(e.target.result);
      const baseFileXLSX = XLSX.read(data, { type: "array" });
      const reader2 = new FileReader();
      reader2.onload = function(e2) {
        if (e2.target && e2.target.result) {
          // @ts-ignore
          const data2 = new Uint8Array(e2.target.result);
          const bloctelAnswerXLSX = XLSX.read(data2, {
            type: "array",
          });
          mapOds(baseFile, baseFileXLSX, bloctelAnswerXLSX, callback);
        }
      };
      reader2.readAsArrayBuffer(bloctelAnswer[0]);
    }
  };
  reader.readAsArrayBuffer(baseFile[0]);
}

export function parseAndMapCSV(
  baseFile: File[],
  bloctelAnswer: File[],
  callback: (error: string, success: string) => void
): void {
  const reader = new FileReader();
  reader.onload = function(e) {
    if (e.target && e.target.result) {
      // @ts-ignore
      const data = new Uint8Array(e.target.result);
      const baseFileXLSX = XLSX.read(data, { type: "array" });
      const reader2 = new FileReader();
      reader2.onload = function(e2) {
        if (e2.target && e2.target.result) {
          const bloctelAnswerCsv = e2.target.result.toString();
          mapCsv(baseFile, baseFileXLSX, bloctelAnswerCsv, callback);
        }
      };
      reader2.readAsText(bloctelAnswer[0]);
    }
  };
  reader.readAsArrayBuffer(baseFile[0]);
}

function mapOds(
  baseFile: File[],
  base: WorkBook,
  answer: WorkBook,
  callback: (error: string, success: string) => void
) {
  const allowedPhoneNumbers = getAllowedPhoneNumbersOds(answer);
  doMap(baseFile, base, allowedPhoneNumbers, callback);
}

function mapCsv(
  baseFile: File[],
  base: WorkBook,
  answerCsv: string,
  callback: (error: string, success: string) => void
) {
  const allowedPhoneNumbers = getAllowedPhoneNumbersCsv(answerCsv);
  console.error(allowedPhoneNumbers);
  doMap(baseFile, base, allowedPhoneNumbers, callback);
}

function doMap(
  baseFile: File[],
  base: WorkBook,
  allowedPhoneNumbers: string[],
  callback: (error: string, success: string) => void
) {
  const first_sheet_name = base.SheetNames[0];
  const worksheet = base.Sheets[first_sheet_name];
  let consecutiveEmptyLines = 0;
  let ignoredCount = 0;
  let acceptedCount = 0;
  let i = 2;

  while (consecutiveEmptyLines <= 5 && i < 5000) {
    console.error(consecutiveEmptyLines, i);
    const identifierCell = worksheet["B" + i];
    if (identifierCell) {
      consecutiveEmptyLines = 0;
      ["H", "I", "J", "K"].forEach((column: string) => {
        const phoneNumberCell = worksheet[column + i];
        if (phoneNumberCell && phoneNumberCell.v) {
          const phoneNumber = phoneNumberCell.v.trim();
          if (!phoneNumber) {
            callback(
              "La cellule '" +
                column +
                i +
                "' du fichier " +
                baseFile[0].name +
                " devrait correspondre à l'identifiant bloctel mais j'ai trouvé '" +
                phoneNumberCell.v +
                "', je me suis planté ou c'est toi ?",
              ""
            );
            return;
          } else {
            if (!allowedPhoneNumbers.includes(phoneNumber)) {
              phoneNumberCell.v = "REJETE PAR BLOCTEL";
              ignoredCount++;
            } else {
              phoneNumberCell.v = phoneNumberCell.v + "";
              acceptedCount++;
            }
          }
        }
      });
    } else {
      consecutiveEmptyLines++;
    }
    i++;
  }

  // Write result
  const fileName =
    baseFile[0].name
      .replace(".ods", "")
      .replace(".xlsx", "")
      .replace(".xls", "")
      .trim()
      .substring(0, 15) + "-FUSION-BLOCTEL.ods";
  try {
    XLSX.writeFile(base, fileName);
  } catch (e) {
    callback(e, "");
  }
  callback(
    "",
    "- " +
      i +
      " lignes dans le fichier " +
      baseFile[0].name +
      "<br/>- " +
      (ignoredCount + acceptedCount) +
      " numéros en tout dont" +
      "<br/>- " +
      acceptedCount +
      " numéros acceptés par bloctel et " +
      "<br/>- " +
      ignoredCount +
      " numéros écartés par bloctel"
  );
}

function getAllowedPhoneNumbersOds(answer: WorkBook): string[] {
  const allowedPhoneNumbers = [];
  const first_sheet_name = answer.SheetNames[0];
  const worksheet = answer.Sheets[first_sheet_name];
  let reachedEnd = false;
  let i = 2;
  while (!reachedEnd) {
    const identifierCell = worksheet["B" + i];
    if (identifierCell) {
      const phoneNumberCell = worksheet["A" + i];
      if (phoneNumberCell && phoneNumberCell.v) {
        const phoneNumber = ("" + phoneNumberCell.v).trim();
        const bloctelStatusCell = worksheet["C" + i];
        if (
          bloctelStatusCell &&
          bloctelStatusCell.v &&
          bloctelStatusCell.v.trim() == "OK"
        ) {
          allowedPhoneNumbers.push(phoneNumber);
        }
      }
    } else {
      reachedEnd = true;
    }
    i++;
  }
  return allowedPhoneNumbers;
}

function getAllowedPhoneNumbersCsv(csv: string): string[] {
  const allowedPhoneNumbers: string[] = [];
  const lines = csv.split("\n");
  lines.forEach((line) => {
    const cells = line.split(";");
    if (cells[2] && cells[2].trim() == "OK") {
      allowedPhoneNumbers.push(cells[0].trim());
    }
  });
  return allowedPhoneNumbers;
}

function getPhoneNumbers(base: WorkBook): PhoneNumberResult {
  const phoneNumbers: string[] = [];
  const first_sheet_name = base.SheetNames[0];
  const worksheet = base.Sheets[first_sheet_name];
  let consecutiveEmptyLines = 0;
  let i = 2;
  while (consecutiveEmptyLines <= 5) {
    const identifierCell = worksheet["B" + i];
    if (identifierCell) {
      consecutiveEmptyLines = 0;
      let foundPhone = false;
      ["H", "K", "I", "J"].forEach((column: string) => {
        const phoneNumber = worksheet[column + i];
        if (
          !foundPhone &&
          phoneNumber &&
          phoneNumber.v &&
          phoneNumber.v.trim().length >= 4
        ) {
          phoneNumbers.push(phoneNumber.v.trim());
          foundPhone = true;
        }
      });
    } else {
      consecutiveEmptyLines++;
    }
    i++;
  }
  const phoneNumberResult = new PhoneNumberResult();
  phoneNumberResult.lines = i;
  phoneNumberResult.phonesNumber = phoneNumbers;
  return phoneNumberResult;
}

class PhoneNumberResult {
  lines: number;
  phonesNumber: string[];
}
