const ApiResponse = require('../helpers/ApiResponse')
const { IssueRepository } = require('../database')
const issueRepository = new IssueRepository()

const getAllIssues = async (req, res, next) => {
    try {
        const issues = await issueRepository.GetAllIssues()
        new ApiResponse(res).status(200).data({ issues }).send()
    } catch (e) {
        next(e)
    }
}
const deleteAIssue = async (req, res, next) => {
    const { id } = req.params
    try {
        await issueRepository.DeleteAIssue(id)
        new ApiResponse(res).status(200).msg('Issue deleted.').send()
    } catch (e) {
        next(e)
    }
}
module.exports = { getAllIssues, deleteAIssue }
