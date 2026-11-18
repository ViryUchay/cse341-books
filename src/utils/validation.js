
const isPlainObject = (value) =>
  value !== null &&
  typeof value === 'object' &&
  !Array.isArray(value);

const isValidId = (value) =>
  typeof value === 'string' &&
  /^[A-Za-z0-9_-]{1,64}$/.test(value);

const isValidDate = (value) => {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
};

export const validateBookInput = (body, includeId = true) => {
  if (!isPlainObject(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  if (includeId && !isValidId(body.id)) {
    return {
      error: 'Book ID must contain 1–64 letters, numbers, underscores, or hyphens'
    };
  }

  if (!isValidId(body.authorId)) {
    return {
      error: 'Author ID must contain 1–64 letters, numbers, underscores, or hyphens'
    };
  }

  if (
    typeof body.title !== 'string' ||
    body.title.trim().length < 1 ||
    body.title.trim().length > 500
  ) {
    return {
      error: 'Title must contain between 1 and 500 characters'
    };
  }

  if (!isValidDate(body.publicationDate)) {
    return {
      error: 'Publication date must be a valid date in YYYY-MM-DD format'
    };
  }

  const data = {
    authorId: body.authorId,
    title: body.title.trim(),
    publicationDate: body.publicationDate
  };

  if (includeId) {
    data.id = body.id;
  }

  return { data };
};

export const validateAuthorInput = (body, includeId = true) => {
  if (!isPlainObject(body)) {
    return { error: 'Request body must be a JSON object' };
  }

  if (includeId && !isValidId(body.id)) {
    return {
      error: 'Author ID must contain 1–64 letters, numbers, underscores, or hyphens'
    };
  }

  if (
    typeof body.name !== 'string' ||
    body.name.trim().length < 1 ||
    body.name.trim().length > 200
  ) {
    return {
      error: 'Author name must contain between 1 and 200 characters'
    };
  }

  if (
    !Number.isInteger(body.birthYear) ||
    body.birthYear < 1000 ||
    body.birthYear > 2100
  ) {
    return {
      error: 'Birth year must be an integer between 1000 and 2100'
    };
  }

  const data = {
    name: body.name.trim(),
    birthYear: body.birthYear
  };

  if (includeId) {
    data.id = body.id;
  }

  return { data };
};
