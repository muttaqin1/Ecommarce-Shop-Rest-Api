const { Schema, model } = require('mongoose')

const IssueSchema = new Schema(
    {
        title: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        body: { type: String, required: true, trim: true },
    },
    { timestamps: true, versionKey: false }
)

const Issue = new model('Issue', IssueSchema)
module.exports = Issue
