
import {Response, Request} from 'express'
import {OutputErrorsType} from '../input-output-types/output-errors-type'
import {db} from '../db/db'
import {InputVideoType, OutputVideoType, Resolutions, UpdateVideoType} from '../input-output-types/video-types'

const inputValidation = (video: UpdateVideoType) => {
    const errors: OutputErrorsType = { // объект для сбора ошибок
        errorsMessages: []
    }

    if(!video.title){
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if(video.title && video.title.trim().length > 40) {
        errors.errorsMessages.push({message:'More then 40 symbols', field: 'title'})
    }

    if(video.title && video.title.trim().length < 1) {
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if(!video.author){
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if(video.author && video.author.trim().length > 20) {
        errors.errorsMessages.push({message:'More then 20 symbols', field: 'title'})
    }

    if(video.author && video.author.trim().length < 1) {
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if (!Array.isArray(video.availableResolution)
        || video.availableResolution.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'At least one resolution should be added', field: 'availableResolution'
        })
    }

    if (!video.canBeDownloaded) {
        errors.errorsMessages.push({
            message: 'No information', field: 'canBeDownloaded'
        })
    }

    if(video.minAgeRestriction && (video.minAgeRestriction > 18 || video.minAgeRestriction < 1)) {
        errors.errorsMessages.push({
            message: 'Age restriction can\'t be less then 1 and more then 18' , field: 'minAgeRestriction'
        })
    }


    return errors
}

export const updateVideoController = (req: Request<any, any, UpdateVideoType>, res: Response) => {

    const foundVideo =db.videos.find(v => v.id === + req.params.videoId)
    if(!foundVideo){
        res.status(404);
        return
    }

    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
    }


    foundVideo.title= req.body.title
    foundVideo.author= req.body.author
    foundVideo.canBeDownloaded= req.body.canBeDownloaded
    foundVideo.minAgeRestriction= req.body.minAgeRestriction
    foundVideo.publicationDate= new Date().toISOString()
    foundVideo.availableResolution= req.body.availableResolution

    res
        .status(204)
}
