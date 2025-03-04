import {OutputErrorsType} from "./output-errors-type";
import {Resolutions} from "./video-types";

export const tittleFieldValidator = (title: string, errors: OutputErrorsType) => {

    if(!title){
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if(title && title.trim().length > 40) {
        errors.errorsMessages.push({message:'More then 40 symbols', field: 'title'})
    }

    if(title && title.trim().length < 1) {
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }
}

export const authorFieldValidator = (author: string, errors: OutputErrorsType) => {

    if(!author){
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }

    if(author && author.trim().length > 20) {
        errors.errorsMessages.push({message:'More then 20 symbols', field: 'title'})
    }

    if(author && author.trim().length < 1) {
        errors.errorsMessages.push({
            message: 'No title', field: 'title',
        })
    }
}

export const availableResolutionFieldValidator = (availableResolutions: Resolutions[], errors: OutputErrorsType) => {
    if (!Array.isArray(availableResolutions)
        || availableResolutions.find(p => !Resolutions[p])
    ) {
        errors.errorsMessages.push({
            message: 'At least one resolution should be added', field: 'availableResolution'
        })
    }
}

export const ageRestrictionFieldValidator = (minAgeRestriction: number, errors: OutputErrorsType) => {
    if(minAgeRestriction && (minAgeRestriction > 18 || minAgeRestriction < 1)) {
        errors.errorsMessages.push({
            message: 'Age restriction can\'t be less then 1 and more then 18' , field: 'minAgeRestriction'
        })
    }
}

export const canBeDownloadedFieldValidator = (canBeDownloaded: boolean, errors: OutputErrorsType) => {
    if (!canBeDownloaded) {
        errors.errorsMessages.push({
            message: 'No information', field: 'canBeDownloaded'
        })
    }
}