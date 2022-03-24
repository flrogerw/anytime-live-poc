const { v4: uuidv4 } = require('uuid');

/**
 * Error to be returned to client.
 */
class GeneralError {
  constructor(error) {
    this.id = uuidv4();
    this.status = 500;

    if (error) {
      if (error.response && error.response.status) {
        this.status = error.response.status;
      } else if (error.status) {
        this.status = error.status;
      }

      switch(this.status) {
        case(400):
          this.title = 'Bad Request';
          this.detail = `You entered a bad request. ${error.message}`;
          break;
        case(401):
          this.title = 'Unauthorized';
          this.detail = 'Authentication not valid or not provided.';
          break;
        case(404):
          this.title = 'Not Found';
          this.detail = 'The resource you requested was not found.';
          break;
        case(409):
          this.title = 'Conflict';
          this.detail = 'You entered a record that already exists.';
          break;
        default:
          this.title = 'Internal server error';
          this.detail = 'Something went wrong.';
          break;
      }
    }
  }
}

function getError(error) {
  const ge = new GeneralError(error);
  return { status: ge.status, error: { errors: [ge] } };
}

module.exports = {
  getError
}
