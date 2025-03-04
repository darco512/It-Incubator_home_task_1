
import {Request, Response} from 'express'
import {db} from '../db/db'
import {OutputVideoType} from "../input-output-types/video-types";

export const getVideosController = (req: Request, res: Response<OutputVideoType[]>) => {
    const videos: OutputVideoType[] = db.videos // получаем видео из базы данных

    res
        .status(200)
        .json(videos) // отдаём видео в качестве ответа
}

// не забудьте добавить эндпоинт в апп
