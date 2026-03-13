import { UserAttributesPublic } from '@brz/shared'

declare global {
    namespace Express {
        interface Request {
            user?: UserAttributesPublic
        }
    }
}

export { }
