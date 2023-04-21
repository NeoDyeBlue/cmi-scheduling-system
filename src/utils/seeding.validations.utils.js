import errorThrower from './error.util';

export function validateRooms(documents) {
  for (let document of documents) {
    for (let fieldName in document) {
      if (fieldName === 'code') {
        const isDuplicated =
          documents.filter(
            (doc) =>
              doc.code.toLowerCase() === document[fieldName].toLowerCase()
          ).length > 1;
        if (isDuplicated) {
          throw errorThrower('ErrorId', 'Room code should be unique.');
        }
      }
    }
  }
}

export function validateCourses(documents) {
  for (let document of documents) {
    for (let fieldName in document) {
      if (fieldName === 'code') {
        const isDuplicated =
          documents.filter(
            (doc) =>
              doc.code.toLowerCase() === document[fieldName].toLowerCase()
          ).length > 1;
        if (isDuplicated) {
          throw errorThrower('ErrorId', 'Course code should be unique.');
        }
      }
    }
  }
}

export function valiDateSubjects(documents) {
  for (let document of documents) {
    for (let fieldName in document) {
      if (fieldName === 'code') {
        const isDuplicated =
          documents.filter(
            (doc) =>
              doc.code.toLowerCase() === document[fieldName].toLowerCase()
          ).length > 1;
        if (isDuplicated) {
          throw errorThrower('ErrorId', 'Subject code should be unique.');
        }
      }
    }
  }
}
