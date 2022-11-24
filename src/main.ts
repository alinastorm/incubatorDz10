
import mongoDbClient from'./_common/services/mongoDb/mongoDbClient'
import gmail from "./_common/services/email/gmail-adapter";
import periodicTasks from"./_common/services/taskManager/periodicTasks-service";
import httpService from './_common/services/http/http-service';



const a = mongoDbClient
const b = gmail
const c = periodicTasks
const d = httpService
