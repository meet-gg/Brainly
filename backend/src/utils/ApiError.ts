class ApiError extends Error {
    statusCode: number
    success: boolean
    data: any
    errors: any

    constructor(statusCode: number, message: string, errors?: any) {
        super(message)
        this.statusCode = statusCode
        this.success = false
        this.data = null
        this.errors = errors
        Error.captureStackTrace(this, this.constructor)
    }
}

export { ApiError }