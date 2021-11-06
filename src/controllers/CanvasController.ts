import CanvasRepository from "../models/canvas/CanvasRepository";

export class CanvasController {

  constructor(
    private _canvasRepository: CanvasRepository
  ){}
  getCanvases = async (_req, res, next) => {
    try {
      const canvases = await this._canvasRepository.findAll()
      return res.json(canvases);
    } catch (e) {
      return next(e);
    }
  }
}