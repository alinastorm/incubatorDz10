import mongoDbClient from './_common/services/mongoDb/mongoDbClient'
import emailService from "./_common/services/email/email-service";
import periodicTasks from "./_common/services/taskManager/periodicTasks-service";
import httpService from './_common/services/http/http-service';



await mongoDbClient.connect()
await mongoDbClient.ping()
await emailService.connect()
periodicTasks.run()
httpService.setRoutes()
httpService.setMiddlewares()
httpService.runHttpsServer()
// httpService.runHttpServer()
