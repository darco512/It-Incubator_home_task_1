import {db} from "../db/db";
import {Response, Request} from 'express'

export const deleteVideoController = (req: Request, res: Response) => {
    const foundVideo =db.videos.find(v => v.id === + req.params.videoId)
    if(!foundVideo){
         res.status(404);
        return
    }

    db.videos = db.videos.filter(v => v.id !== req.params.id)
    res.status(204)
}