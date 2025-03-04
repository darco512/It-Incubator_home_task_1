import {Response, Request} from 'express'
import {db} from '../db/db'
import {OutputVideoType} from "../input-output-types/video-types";


export const findVideoController = (req: Request,  res: Response<OutputVideoType>) => {
    const foundVideo :OutputVideoType =db.videos.find(v => v.id === + req.params.videoId)
    if(!foundVideo){
         res.status(404);
        return
    }

     res
        .status(200)
        .json(foundVideo)

}