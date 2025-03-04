
import {Request, Response, Router} from 'express'
import {db} from "../db/db";
import {OutputVideoType} from "../input-output-types/video-types";
import {OutputErrorsType} from "../input-output-types/output-errors-type";
import {
    ageRestrictionFieldValidator,
    authorFieldValidator,
    availableResolutionFieldValidator, canBeDownloadedFieldValidator, dateFormatValidator,
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
        const availableResolutions = req.body.availableResolutions
        const errors :OutputErrorsType = {
            errorsMessages : []
        }
        tittleFieldValidator(title, errors)
        authorFieldValidator(author, errors)
        availableResolutionFieldValidator(availableResolutions, errors)

        if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
            res
                .status(400)
                .json(errors)
            return
        }

        function addDays(date: Date, days: number): Date {
            const result = new Date(date);
            result.setDate(result.getDate() + days);
            return result;
        }

        const newVideo: OutputVideoType = {
            ...req.body,
            id: Date.now() + Math.random(),
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date().toISOString(),
            publicationDate: addDays(new Date(), 1).toISOString(),
            availableResolutions: req.body.availableResolutions,
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
        const availableResolutions = req.body.availableResolutions
        const publicationDate = req.body.publicationDate
        const errors :OutputErrorsType = {
            errorsMessages : []
        }

        tittleFieldValidator(title, errors)
        authorFieldValidator(author, errors)
        availableResolutionFieldValidator(availableResolutions, errors)
        ageRestrictionFieldValidator(minAgeRestriction, errors)
        canBeDownloadedFieldValidator(canBeDownloaded,errors)
        dateFormatValidator(publicationDate, errors)

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
        foundVideo.availableResolutions = availableResolutions

        res
            .sendStatus(204)
    },

    deleteVideo (req: Request, res: Response) {
        const foundVideo =db.videos.find(v => v.id === +req.params.id)
        if(!foundVideo){
            res.sendStatus(404);
            return
        }

        db.videos = db.videos.filter(v => v.id !== req.params.id)
        res.sendStatus(204)
    }
}

videosRouter.get('/', videoController.getVideos)
videosRouter.post('/', videoController.createVideo)
videosRouter.get('/:id', videoController.findVideo)
videosRouter.put('/:id', videoController.updateVideo)
videosRouter.delete('/:id', videoController.deleteVideo)

