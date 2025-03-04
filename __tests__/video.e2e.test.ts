import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {dataset1} from './datasets'
import {SETTINGS} from '../src/settings'
import {InputVideoType, Resolutions, UpdateVideoType} from "../src/input-output-types/video-types";

describe('/videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        // setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        // expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {
        // setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        // expect(res.body.length).toBe(1)
        // expect(res.body[0]).toEqual(dataset1.videos[0])
    })
    it('should create', async () => {
        setDB()
        const newVideo: any /*InputVideoType*/ = {
            title: 't1',
            author: 'a1',
            availableResolutions: ['P144' /*Resolutions.P144*/]
            // ...
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            .expect(201)

        console.log(res.body)

        expect(res.body.availableResolution).toEqual(newVideo.availableResolution)
    })
    it('shouldn\'t find', async () => {
        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(404) // проверка на ошибку

        console.log(res.body)
    })

    it ('shouldn\'t delete', async () => {
        await req
            .get(SETTINGS.PATH.VIDEOS + '/1')
            .expect(404)
    })

    it('shouldn delete', async () => {
        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(201)

        const id = res.body.id;

        await req
            .delete(`${SETTINGS.PATH.VIDEOS}/${id}`)
            .expect(204)
    })

    it('shouldn\'t update', async () => {

        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(201)


        const updatedVideo: UpdateVideoType = {
            title: "new title",
            author: "new author",
            canBeDownloaded: true,
            minAgeRestriction: 120,
            publicationDate: '1994',
            availableResolutions: [Resolutions.P360, Resolutions.P1080]
        }

        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${res.body.id}`)
            .send(updatedVideo)
            .expect(400)
    })

    it('should update', async () => {
        const newVideo: InputVideoType = {
            title: 't1',
            author: 'a1',
            availableResolutions: [Resolutions.P144]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo)
            .expect(201)


        const updatedVideo: UpdateVideoType = {
            title: "new title",
            author: "new author",
            canBeDownloaded: true,
            minAgeRestriction: 12,
            publicationDate: res.body.publicationDate,
            availableResolutions: [Resolutions.P360, Resolutions.P1080]
        }

        await req
            .put(`${SETTINGS.PATH.VIDEOS}/${res.body.id}`)
            .send(updatedVideo)
            .expect(204)
    })
})