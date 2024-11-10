export const STATUS_CODES = {
      OK:200,
      BAD_REQUEST:400,
      UN_AUTHORIZED:403,
      NOT_FOUND:404,
      INTERNAL_ERROR:500
} as const

// interface AppErrorOptions {
//       name: string;
//       statusCode: number;
//       description: string;
//       isOperational: boolean;
//       errorStack?: string;
//       loggingErrorResponse?: boolean;
//   }

class AppError extends Error{
      constructor(
        public name: string,
        public statusCode: number,
        public description: string,
        public isOperational: boolean,
        public errorStack?: string,
        public LogError?: boolean,
        public loggingErrorResponse?:boolean,
      ){
            super(description);
            Object.setPrototypeOf(this,new.target.prototype);
            
             // Automatically sets the stack trace to start from this constructor avoiding the class itself but start from the instance of this class
            Error.captureStackTrace(this, this.constructor);
      }
}
//api Specific Errors
class APIError extends AppError {
      constructor(
            name: string,
            statusCode: number = STATUS_CODES.INTERNAL_ERROR,
            description: string = "Internal Server Error",
            isOperational: boolean = true
      ) {
        super(name, statusCode, description, isOperational);
      }
    }

    //400
    class BadRequestError extends AppError {
      constructor(description: string = "Bad request", loggingErrorResponse?: boolean) {
          super(
              "BAD REQUEST",
              STATUS_CODES.BAD_REQUEST,
              description,
              true,
              undefined,
              loggingErrorResponse
          );
      }
  }

//400
class ValidationError extends AppError {
      constructor(description: string = "Validation Error", errorStack?: string) {
          super(
              "VALIDATION ERROR",
              STATUS_CODES.BAD_REQUEST,
              description,
              true,
              errorStack
          );
      }
  }
  
    

    export { AppError, APIError, BadRequestError, ValidationError };