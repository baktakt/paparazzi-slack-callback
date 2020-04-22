import IScreenshot from "./IScreenShot.interface";

interface ICaptureInput {
  id: string
  screenshots: [IScreenshot]
  zipped_url: string
}

export default ICaptureInput