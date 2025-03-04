
import {Response, Request} from 'express'
import {OutputErrorsType} from '../input-output-types/output-errors-type'
import {db} from '../db/db'
import {InputVideoType, OutputVideoType, Resolutions} from '../input-output-types/video-types'

const inputValidation = (video: InputVideoType) => {
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
    return errors
}

export const createVideoController = (req: Request<any, any, InputVideoType>, res: Response<OutputVideoType | OutputErrorsType>) => {
    const errors = inputValidation(req.body)
    if (errors.errorsMessages.length) { // если есть ошибки - отправляем ошибки
        res
            .status(400)
            .json(errors)
        return
        // return res.status(400).json(errors)
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
}
