import request from "supertest"
import mongoDbClient from "../../_common/services/mongoDb/mongoDbClient"
import httpService from "../../_common/services/http/http-service"
import { BlogInputModel, BlogViewModel } from "../../Blogs/types"
import { Paginator } from "../../_common/abstractions/Repository/types"
import { PostInputModel, PostViewModel } from "../../Posts/types"


//Express
const app = httpService.appExpress


function checkData(obj: { [key: string]: any }, key: keyof typeof obj, val: any) {
    if (obj[key] != val) return obj
    return true
}

describe("posts", () => {

    beforeAll(async () => {
        //Конектим mongo клиента
        await mongoDbClient.disconnect();
        await mongoDbClient.connect()
        //Устанавливаем роуты и middlewares
        httpService.setMiddlewares()
        httpService.setRoutes()
    })
    afterAll(async () => {
        // await mongoDbClient.disconnect()
    })

    /** ****************************************************************************************** */
    const newBlog: BlogInputModel = {
        "name": "stringasda",
        "description": "stringadas",
        "websiteUrl": "https://someurl.com"
    }
    const blogSchema: BlogViewModel = {
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        websiteUrl: expect.any(String),
        createdAt: expect.any(String),
    }
    const blogPaginationSchema: Paginator<BlogViewModel> = {
        page: expect.any(Number),
        pagesCount: expect.any(Number),
        pageSize: expect.any(Number),
        totalCount: expect.any(Number),
        items: [blogSchema]
    }
    let blogReceived: BlogViewModel
    const blogUpdate: BlogInputModel = {
        "name": "string2",
        "description": "",
        "websiteUrl": "https://someurl2.com"
    }
    let newPost: PostInputModel = {
        "title": "string",
        "shortDescription": "string",
        "content": "string",
        "blogId": "123"
    }
    const postViewSchema: PostViewModel = {
        id: expect.any(String),
        title: expect.any(String),
        shortDescription: expect.any(String),
        content: expect.any(String),
        blogId: expect.any(String),
        blogName: expect.any(String),
        createdAt: expect.any(String)
    }

    test('All delete', async () => {
        const { status } = await request(app).delete("/testing/all-data")
        expect(status).toBe(204)
    })
    test('GET Blogs =[]', async () => {
        const { status, body } = await request(app).get("/blogs")

        expect(status).toBe(200)

        expect(body).toStrictEqual({
            "pagesCount": 0,
            "page": 1,
            "pageSize": 10,
            "totalCount": 0,
            "items": []
        })

    })
    test('POST Blogs unauthorized', async () => {
        const { status, body } = await request(app)
            .post("/blogs")
            .send({
                "name": "string",
                "youtubeUrl": "https://someurl.com"
            })

        expect(status).toBe(401)
    })
    test('POST Blogs ', async () => {
        const req = await request(app)
            .post("/blogs")
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newBlog)


        expect(checkData(req, "statusCode", 201)).toBe(true)
        expect(req.body).toMatchObject(blogSchema)

        blogReceived = req.body
    })
    test('GET Blogs []', async () => {
        const { status, body } = await request(app).get("/blogs")

        expect(status).toBe(200)

        expect(body).toStrictEqual({
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [blogSchema]
        })

    })
    test('GET Blogs ID', async () => {
        const { status, body } = await request(app).get(`/blogs/${blogReceived?.id}`)

        expect(status).toBe(200)
        expect(body).toMatchObject(blogSchema)
        expect(body).toStrictEqual(blogReceived)
    })
    test('PUT Blogs ', async () => {

        const { status } = await request(app)
            .put(`/blogs/${blogReceived?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(blogUpdate)

        expect(status).toBe(204)

    })
    test('GET Blog after update ', async () => {

        const { status, body } = await request(app).get(`/blogs/${blogReceived?.id}`)

        expect(status).toBe(200)
        // expect(body).toMatchObject(blogPagination)
        expect(body).toStrictEqual({ ...blogReceived, ...blogUpdate })

    })
    test('GET Blogs after update', async () => {

        const { status, body } = await request(app).get("/blogs")

        expect(status).toBe(200)
        expect(body).toMatchObject(blogPaginationSchema)
        expect(body).toStrictEqual({
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 1,
            "items": [blogSchema]
        })
        expect(body.items.length).toBe(1)
        expect(body.items[0]).toStrictEqual({ ...blogReceived, ...blogUpdate })
    })
    test('POST newPost in Blog by Blog ID', async () => {
        const { status, body } = await request(app)
            .post(`/blogs/${blogReceived?.id}/posts`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')
            .send(newPost)

        expect(status).toBe(201)
        expect(body).toMatchObject(postViewSchema)
        // post = body
    })
    test('Delete Blog by ID', async () => {

        const { status } = await request(app)
            .delete(`/blogs/${blogReceived?.id}`)
            .set('Authorization', 'Basic YWRtaW46cXdlcnR5')

        expect(status).toBe(204)
    })
    test('GET Blog after delete ', async () => {
        const { status } = await request(app).get(`/blogs/${blogReceived?.id}`)

        expect(status).toBe(404)

    })
})