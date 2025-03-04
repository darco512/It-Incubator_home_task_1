
import {Request, Response, Router} from 'express'
import {getVideosController} from './getVideosController'
import {createVideoController} from './createVideoController'
import {db} from "../db/db";
import {findVideoController} from './findVideoController'
import {updateVideoController} from './updateVideoController'
import {deleteVideoController} from './deleteVideoController'

export const videosRouter = Router()

const videoController = {
    getVideosController: getVideosController,
    createVideoController: createVideoController,
    findVideoController: findVideoController,
    updateVideoController: updateVideoController,
    deleteVideoController: deleteVideoController
}

videosRouter.get('/', videoController.getVideosController)
videosRouter.post('/', videoController.createVideoController)
videosRouter.get('/:id', videoController.findVideoController)
videosRouter.put('/:id', videoController.updateVideoController)
videosRouter.delete('/:id', videoController.deleteVideoController)

// ...

// не забудьте добавить роут в апп
