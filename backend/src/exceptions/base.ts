export class BaseException extends Error {
    public readonly code: number

    constructor(message: string, code: number = 401) {
        super(message)
        this.code = code
        // Object.setPrototypeOf(this, BaseException.prototype) // ! DO NOT USE THIS, IT BREAKS THE PROTOTYPE CHAIN AND CAUSES ISSUES WITH INSTANCEOF CHECKS
    }
}