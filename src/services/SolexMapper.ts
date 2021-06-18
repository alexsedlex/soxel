/* eslint-disable @typescript-eslint/ban-ts-comment */
import XLSX, { WorkBook } from "xlsx";

export default function parseAndMap(
  baseFile: File[],
  bloctelAnswer: File[],
  callback: (r: File[]) => void
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
          const bloctelAnswerXLSX = XLSX.read(data2, { type: "array" });
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
  callback: (r: File[]) => void
) {
  XLSX.writeFile(base, baseFile[0].name + " FUSION BLOCTEL.ods");
  callback(baseFile);
}
