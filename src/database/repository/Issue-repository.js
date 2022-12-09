const Issue = require('../models/Issue')
const { APIError, STATUS_CODES } = require('../../helpers/AppError')
class IssueRepository {
    async Create(object) {
        try {
            return await Issue.create(object)
        } catch {
            throw new APIError(
                'API ERROR',
                STATUS_CODES.INTERNAL_ERROR,
                'Failed to create a Issue!'
            )
        }
    }
    async GetAllIssues() {
        try {
            return await Issue.find()
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to get Issues!')
        }
    }
    async DeleteAIssue(id) {
        try {
            return await Issue.deleteOne({ _id: id })
        } catch {
            throw new APIError('API ERROR', STATUS_CODES.INTERNAL_ERROR, 'Failed to delete Issue.')
        }
    }
}

module.exports = IssueRepository
