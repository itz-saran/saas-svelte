import * as pdfjs from "pdfjs-dist";

//@ts-expect-error no module decalration found
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.js";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default pdfjs;
