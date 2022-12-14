import { Request } from 'express';

import usersRepository from '../Users/users-repository';


import postsRepository from '../Posts/posts-repository';
import blogsRepository from '../Blogs/blogs-repository';
import authRepository from '../Auth/Authentication/auth-repository';
import { HTTP_STATUSES, ResponseWithCode } from '../_common/services/http/types';
import devicesRepository from '../Auth/DevicesSessions/deviceSessions-repository';
import registrationCodesRepository from "../Auth/Registration/registration-repository"
import recoveryPasswordRepository from '../Auth/RecoveryPassword/recoveryPassword-repository';

class TestingController {

    async deleteAll(req: Request, res: ResponseWithCode<204>) {
        await postsRepository.deleteAll()
        await blogsRepository.deleteAll()
        await usersRepository.deleteAll()
        await authRepository.deleteAll()
        await devicesRepository.deleteAll()
        await registrationCodesRepository.deleteAll()
        await recoveryPasswordRepository.deleteAll()
        res.status(HTTP_STATUSES.NO_CONTENT_204).send('All data is deleted')
    }


}
export default new TestingController()