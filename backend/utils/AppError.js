class AppError {
    constructor(message,statusCode, data = null){
        this.message = message
        this.statusCode = statusCode
        this.status = 'Fail'
        this.isOperational = true
        this.data = data
    }
    

}

module.exports = AppError