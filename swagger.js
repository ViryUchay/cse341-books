
const errorResponse = {
  description: 'Error response',
  content: {
    'application/json': {
      schema: {
        $ref: '#/components/schemas/Error'
      },
      example: {
        error: 'Resource not found'
      }
    }
  }
};

const jsonResponse = (description, schema, example) => ({
  description,
  content: {
    'application/json': {
      schema: {
        $ref: `#/components/schemas/${schema}`
      },
      example
    }
  }
});

const noContentResponse = {
  description: 'Resource deleted successfully'
};

const requestBody = (schema, example) => ({
  required: true,
  content: {
    'application/json': {
      schema: {
        $ref: `#/components/schemas/${schema}`
      },
      example
    }
  }
});

const bookExample = {
  id: 'b1',
  authorId: 'a1',
  title: 'The Great Gatsby',
  publicationDate: '1925-04-10'
};

const authorExample = {
  id: 'a1',
  name: 'F. Scott Fitzgerald',
  birthYear: 1896
};

const swaggerSpec = {
  openapi: '3.0.0',

  info: {
    title: 'CSE341 Books API',
    version: '2.0.0',
    description: 'REST API for managing books and authors using MongoDB.'
  },

  servers: [
    {
      url: '/',
      description: 'Current server'
    }
  ],

  components: {
    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'b1'
          },
          authorId: {
            type: 'string',
            example: 'a1'
          },
          title: {
            type: 'string',
            example: 'The Great Gatsby'
          },
          publicationDate: {
            type: 'string',
            format: 'date',
            example: '1925-04-10'
          }
        }
      },

      Author: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'a1'
          },
          name: {
            type: 'string',
            example: 'F. Scott Fitzgerald'
          },
          birthYear: {
            type: 'integer',
            example: 1896
          }
        }
      },

      Error: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Resource not found'
          }
        }
      }
    }
  },

  paths: {
    '/books': {
      get: {
        summary: 'Get all books',
        responses: {
          200: {
            description: 'List of books',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Book'
                  }
                },
                example: [bookExample]
              }
            }
          },
          500: errorResponse
        }
      },

      post: {
        summary: 'Create a book',
        requestBody: requestBody('Book', bookExample),
        responses: {
          201: jsonResponse('Book created', 'Book', bookExample),
          400: errorResponse,
          415: errorResponse,
          500: errorResponse
        }
      }
    },

    '/books/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          example: 'b1'
        }
      ],

      get: {
        summary: 'Get a book by ID',
        responses: {
          200: jsonResponse('Book found', 'Book', bookExample),
          404: errorResponse,
          500: errorResponse
        }
      },

      put: {
        summary: 'Update a book',
        requestBody: requestBody('Book', {
          authorId: 'a1',
          title: 'Updated Book Title',
          publicationDate: '1925-04-10'
        }),
        responses: {
          200: jsonResponse('Book updated', 'Book', bookExample),
          400: errorResponse,
          404: errorResponse,
          415: errorResponse,
          500: errorResponse
        }
      },

      delete: {
        summary: 'Delete a book',
        responses: {
          204: noContentResponse,
          404: errorResponse,
          500: errorResponse
        }
      }
    },

    '/authors': {
      get: {
        summary: 'Get all authors',
        responses: {
          200: {
            description: 'List of authors',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Author'
                  }
                },
                example: [authorExample]
              }
            }
          },
          500: errorResponse
        }
      },

      post: {
        summary: 'Create an author',
        requestBody: requestBody('Author', authorExample),
        responses: {
          201: jsonResponse('Author created', 'Author', authorExample),
          400: errorResponse,
          415: errorResponse,
          500: errorResponse
        }
      }
    },

    '/authors/{id}': {
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          example: 'a1'
        }
      ],

      get: {
        summary: 'Get an author by ID',
        responses: {
          200: jsonResponse('Author found', 'Author', authorExample),
          404: errorResponse,
          500: errorResponse
        }
      },

      put: {
        summary: 'Update an author',
        requestBody: requestBody('Author', {
          name: 'Updated Author Name',
          birthYear: 1896
        }),
        responses: {
          200: jsonResponse('Author updated', 'Author', authorExample),
          400: errorResponse,
          404: errorResponse,
          415: errorResponse,
          500: errorResponse
        }
      },

      delete: {
        summary: 'Delete an author',
        responses: {
          204: noContentResponse,
          404: errorResponse,
          409: errorResponse,
          500: errorResponse
        }
      }
    }
  }
};

export default swaggerSpec;
