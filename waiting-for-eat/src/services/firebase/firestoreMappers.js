/**
 * Converts a Firestore DocumentSnapshot into application data.
 * Pass an id field when the document ID is part of the application model.
 *
 * @param {{ data: () => object, exists: () => boolean, id: string }} snapshot
 * @param {string} [idField]
 * @returns {object | undefined}
 */
function mapDocumentSnapshot(snapshot, idField) {
  if (!snapshot.exists()) {
    return undefined;
  }

  const data = snapshot.data();

  if (!idField) {
    return data;
  }

  return {
    ...data,
    [idField]: snapshot.id,
  };
}

/**
 * Converts every document in a Firestore QuerySnapshot into application data.
 *
 * @param {{ docs: Array<object> }} snapshot
 * @param {string} [idField]
 * @returns {Array<object>}
 */
function mapQuerySnapshot(snapshot, idField) {
  return snapshot.docs.map((documentSnapshot) =>
    mapDocumentSnapshot(documentSnapshot, idField),
  );
}

export { mapDocumentSnapshot, mapQuerySnapshot };
