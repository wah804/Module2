module.exports = {
    SERVER_ERROR: "Server Error",
    INVALID_ID_FORMAT: "Invalid ID format",
    VALIDATION_ERROR: "Validation Error",
    DUPLICATION_ERROR: "Validation or duplication error",
    NOT_FOUND: (entity, id) => `No ${entity} found with id of ${id}`,
    DELETE_ERROR: (entity) => `Error deleting ${entity}`
};
