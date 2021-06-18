/* eslint-disable @typescript-eslint/ban-ts-comment */
import XLSX, { WorkBook } from "xlsx";

export default function parseAndMap(
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
          map(baseFile, baseFileXLSX, bloctelAnswerXLSX, callback);
        }
      };
      reader2.readAsArrayBuffer(bloctelAnswer[0]);
    }
  };
  reader.readAsArrayBuffer(baseFile[0]);
}

function map(
  baseFile: File[],
  base: WorkBook,
  answer: WorkBook,
  callback: (error: string, success: string) => void
) {
  const allowedIds = getAllowedIds(answer, callback);
  const first_sheet_name = base.SheetNames[0];
  const worksheet = base.Sheets[first_sheet_name];
  let reachedEnd = false;
  let i = 2;
  let ignoredCount = 0;
  while (!reachedEnd) {
    const identifierCell = worksheet["L" + i];
    if (identifierCell) {
      const identifierValue = parseInt(identifierCell.v);
      if (!identifierValue) {
        callback(
          "La cellule 'L" +
            i +
            "' du fichier " +
            baseFile[0].name +
            " devrait correspondre à l'identifiant bloctel mais j'ai trouvé '" +
            identifierCell.v +
            "', je me suis planté ou c'est toi ?",
          ""
        );
        return;
      } else {
        let value = "(OK)";
        let isOk = true;
        if (!allowedIds.includes(identifierValue)) {
          value = "REJETE PAR BLOCTEL";
          ignoredCount++;
          isOk = false;
        }
        const resultCell = worksheet["H" + i];
        if (resultCell && resultCell.v) {
          if (isOk) {
            worksheet["H" + i].v = worksheet["H" + i].v + value;
          } else {
            worksheet["H" + i].v = value;
          }
        } else {
          XLSX.utils.sheet_add_aoa(worksheet, [[value]], {
            origin: "H" + i,
          });
        }
      }
      i++;
    } else {
      reachedEnd = true;
    }
  }

  // Write result
  const fileName =
    baseFile[0].name.replace(".ods", "").trim() + "-FUSION-BLOCTEL.ods";
  XLSX.writeFile(base, fileName);
  callback(
    "",
    "- " +
      i +
      " lignes dans le fichier " +
      baseFile[0].name +
      "<br/>- " +
      ignoredCount +
      " écartées par bloctel<br/>- " +
      (i - ignoredCount) +
      " lignes dans le fichier fusionné"
  );
}

function getAllowedIds(
  answer: WorkBook,
  callback: (error: string, success: string) => void
): number[] {
  const allowedIds = [];
  const first_sheet_name = answer.SheetNames[0];
  const worksheet = answer.Sheets[first_sheet_name];
  let reachedEnd = false;
  let i = 2;
  while (!reachedEnd) {
    const identifierCell = worksheet["B" + i];
    if (identifierCell) {
      const identifierValue = parseInt(identifierCell.v);
      if (!identifierValue) {
        callback(
          "La cellule 'Bs" +
            i +
            "' du fichier bloctel devrait correspondre à l'identifiant bloctel mais j'ai trouvé '" +
            identifierCell.v +
            "', je me suis planté ou c'est toi ?",
          ""
        );
        return [];
      }
      const bloctelStatusCell = worksheet["C" + i];
      if (
        bloctelStatusCell &&
        bloctelStatusCell.v &&
        bloctelStatusCell.v.trim() == "OK"
      ) {
        allowedIds.push(identifierValue);
      }
      i++;
    } else {
      reachedEnd = true;
    }
  }
  return allowedIds;
}
