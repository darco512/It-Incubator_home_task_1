
import {Request, Response, Router} from 'express'
import {db} from "../db/db";
import {OutputVideoType} from "../input-output-types/video-types";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {
    ageRestrictionFieldValidator,
    authorFieldValidator,
    availableResolutionFieldValidator, canBeDownloadedFieldValidator,
    tittleFieldValidator
} from "../input-output-types/input-validation";

export const videosRouter = Router()

const videoController = {
    getVideos (req: Request, res: Response) {
        const videos: OutputVideoType[] = db.videos // получаем видео из базы данных
        res.status(200).json(videos) // отдаём видео в качестве ответа
    },

    createVideo (req: Request, res: Response) {
        const title = req.body.title
        const author = req.body.author
        const availableResolution = req.body.availableResolution
        const errors :OutputErrorsType = {
            errorsMessages : []
        }
        tittleFieldValidator(title, errors)
        authorFieldValidator(author, errors)
        availableResolutionFieldValidator(availableResolution, errors)

        if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
            res
                .status(400)
                .json(errors)
            return
        }

        const newVideo: OutputVideoType = {
            ...req.body,
            id: Date.now() + Math.random(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: true,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
            availableResolution: req.body.availableResolution,
        }
        db.videos = [...db.videos, newVideo]

        res
            .status(201)
            .json(newVideo)
    },

    findVideo (req: Request, res: Response) {
        const foundVideo = db.videos.find(c => c.id === +req.params.id)
        if(!foundVideo){
            res.sendStatus(404);
            return
        }

        res
            .status(200)
            .json(foundVideo)
    },

    updateVideo (req: Request, res: Response) {
        const foundVideo = db.videos.find(v => v.id === +req.params.id)

        if(!foundVideo){
            res.sendStatus(404);
            return
        }

        const title = req.body.title
        const author = req.body.author
        const canBeDownloaded = req.body.canBeDownloaded
        const minAgeRestriction = req.body.minAgeRestriction
        const availableResolution = req.body.availableResolution
        const errors :OutputErrorsType = {
            errorsMessages : []
        }

        tittleFieldValidator(title, errors)
        authorFieldValidator(author, errors)
        availableResolutionFieldValidator(availableResolution, errors)
        ageRestrictionFieldValidator(minAgeRestriction, errors)
        canBeDownloadedFieldValidator(canBeDownloaded,errors)


        if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
            res
                .status(400)
                .json(errors)
            return
        }


        foundVideo.title = title
        foundVideo.author = author
        foundVideo.canBeDownloaded = canBeDownloaded
        foundVideo.minAgeRestriction = minAgeRestriction
        foundVideo.publicationDate = new Date().toISOString()
        foundVideo.availableResolution = availableResolution

        res
            .status(204)
    },

    deleteVideo (req: Request, res: Response) {
        const foundVideo =db.videos.find(v => v.id === +req.params.id)
        if(!foundVideo){
            res.sendStatus(404);
            return
        }

        db.videos = db.videos.filter(v => v.id !== req.params.id)
        res.status(204)
    }
}

videosRouter.get('/', videoController.getVideos)
videosRouter.post('/', videoController.createVideo)
videosRouter.get('/:id', videoController.findVideo)
videosRouter.put('/:id', videoController.updateVideo)
videosRouter.delete('/:id', videoController.deleteVideo)

